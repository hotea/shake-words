import { NextRequest, NextResponse } from "next/server";

// 内存存储在线用户（生产环境建议使用 Redis）
const onlineUsers = new Map<string, number>();

// 清理过期用户（60秒未心跳视为离线）
const CLEANUP_INTERVAL = 60000; // 60秒
const EXPIRE_TIME = 60000; // 60秒

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

    // 更新用户最后活跃时间
    onlineUsers.set(visitorId, Date.now());

    // 返回当前在线人数
    const count = onlineUsers.size;

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // 清理过期用户后返回人数
  const now = Date.now();
  for (const [visitorId, lastSeen] of onlineUsers.entries()) {
    if (now - lastSeen > EXPIRE_TIME) {
      onlineUsers.delete(visitorId);
    }
  }

  return NextResponse.json({ count: onlineUsers.size });
}
