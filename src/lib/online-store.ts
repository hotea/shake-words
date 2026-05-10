import { query, execute } from "@/lib/db/mysql";
import { isMySqlConfigured } from "@/lib/db/mysql";

// ========== 内存热点数据 ==========
const onlineUsers = new Map<string, number>();
const todayUsers = new Set<string>();
let todayDate = getTodayKey();
const allTimeUsers = new Set<string>();

// 入库触发计数器
let writeCounter = 0;
const WRITE_BATCH = 10; // 每 10 次心跳触发一次入库

// 清理配置
const CLEANUP_INTERVAL = 60000;
const EXPIRE_TIME = 60000;

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function checkDateRollover() {
  const current = getTodayKey();
  if (current !== todayDate) {
    todayDate = current;
    todayUsers.clear();
  }
}

// 定期清理过期用户
setInterval(() => {
  const now = Date.now();
  for (const [visitorId, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > EXPIRE_TIME) {
      onlineUsers.delete(visitorId);
    }
  }
}, CLEANUP_INTERVAL);

// ========== 数据库持久化 ==========

async function persistToDb() {
  if (!isMySqlConfigured()) return;

  try {
    const dateKey = getTodayKey();
    const now = new Date();

    // 更新历史总用户数（累加新增）
    const [totalRows] = await query<{ total_count: number }[]>(
      "SELECT total_count FROM online_stats WHERE id = 1"
    );

    if (totalRows) {
      await execute(
        "UPDATE online_stats SET total_count = ?, updated_at = ? WHERE id = 1",
        [allTimeUsers.size, now]
      );
    } else {
      await execute(
        "INSERT INTO online_stats (id, total_count, updated_at) VALUES (1, ?, ?)",
        [allTimeUsers.size, now]
      );
    }

    // 更新今日用户数
    await execute(
      `INSERT INTO online_daily (date_key, count, updated_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE count = VALUES(count), updated_at = VALUES(updated_at)`,
      [dateKey, todayUsers.size, now]
    );
  } catch (error) {
    // 入库失败不中断服务，静默处理
    console.error("[online-store] persist failed:", error);
  }
}

async function loadFromDb() {
  if (!isMySqlConfigured()) return;

  try {
    // 恢复历史总用户数
    const totalRows = await query<{ total_count: number }>(
      "SELECT total_count FROM online_stats WHERE id = 1"
    );
    if (totalRows && totalRows.length > 0) {
      // 用数据库值初始化 allTimeUsers 的计数基准
      // 由于无法恢复具体 visitorId，我们用计数器方式补偿
      (allTimeUsers as any)._dbBaseCount = totalRows[0].total_count;
    }

    // 恢复今日用户数
    const dateKey = getTodayKey();
    const dailyRows = await query<{ count: number }>(
      "SELECT count FROM online_daily WHERE date_key = ?",
      [dateKey]
    );
    if (dailyRows && dailyRows.length > 0) {
      (todayUsers as any)._dbBaseCount = dailyRows[0].count;
    }
  } catch (error) {
    console.error("[online-store] load failed:", error);
  }
}

// 启动时尝试恢复数据
loadFromDb();

// ========== 对外接口 ==========

export function getOnlineStats() {
  checkDateRollover();

  const dbBaseTotal = (allTimeUsers as any)._dbBaseCount || 0;
  const dbBaseToday = (todayUsers as any)._dbBaseCount || 0;

  return {
    count: onlineUsers.size,
    todayCount: Math.max(todayUsers.size, dbBaseToday),
    totalCount: Math.max(allTimeUsers.size + dbBaseTotal, dbBaseTotal),
  };
}

export async function heartbeat(visitorId: string) {
  checkDateRollover();

  // 更新内存热点
  onlineUsers.set(visitorId, Date.now());

  const isNewToday = !todayUsers.has(visitorId);
  const isNewAllTime = !allTimeUsers.has(visitorId);

  todayUsers.add(visitorId);
  allTimeUsers.add(visitorId);

  // 取余触发入库：新用户或每 N 次心跳
  writeCounter++;
  const shouldPersist = isNewAllTime || writeCounter % WRITE_BATCH === 0;

  if (shouldPersist) {
    await persistToDb();
  }

  const dbBaseTotal = (allTimeUsers as any)._dbBaseCount || 0;
  const dbBaseToday = (todayUsers as any)._dbBaseCount || 0;

  return {
    count: onlineUsers.size,
    todayCount: Math.max(todayUsers.size, dbBaseToday),
    totalCount: Math.max(allTimeUsers.size + dbBaseTotal, dbBaseTotal),
  };
}
