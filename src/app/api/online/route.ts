import { NextRequest, NextResponse } from "next/server";

// 内存存储在线用户（生产环境建议使用 Redis）
const onlineUsers = new Map<string, number>();

// 今日在线用户（去重）
const todayUsers = new Set<string>();
let todayDate = getTodayKey();

// 历史总在线用户（去重）
const allTimeUsers = new Set<string>();

// 清理过期用户（60秒未心跳视为离线）
const CLEANUP_INTERVAL = 60000; // 60秒
const EXPIRE_TIME = 60000; // 60秒

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

// 定期清理
setInterval(() => {
  const now = Date.now();
  for (const [visitorId, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > EXPIRE_TIME) {
      onlineUsers.delete(visitorId);
    }
  }
}, CLEANUP_INTERVAL);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId } = body;

    if (!visitorId || typeof visitorId !== "string") {
      return NextResponse.json(
        { error: "Invalid visitorId" },
        { status: 400 }
      );
    }

    checkDateRollover();

    // 更新用户最后活跃时间
    onlineUsers.set(visitorId, Date.now());

    // 记录今日在线和历史总在线
    todayUsers.add(visitorId);
    allTimeUsers.add(visitorId);

    // 返回统计数据
    const count = onlineUsers.size;
    const todayCount = todayUsers.size;
    const totalCount = allTimeUsers.size;

    return NextResponse.json({ count, todayCount, totalCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  checkDateRollover();

  // 清理过期用户后返回人数
  const now = Date.now();
  for (const [visitorId, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > EXPIRE_TIME) {
      onlineUsers.delete(visitorId);
    }
  }

  return NextResponse.json({
    count: onlineUsers.size,
    todayCount: todayUsers.size,
    totalCount: allTimeUsers.size,
  });
}
