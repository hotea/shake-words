import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";
import { getCurrentUserId } from "@/lib/auth/session";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const users = await query<{ id: string; email: string; name: string | null; email_verified: number }>(
      "SELECT id, email, name, email_verified FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = users[0];
    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name ?? undefined, emailVerified: !!user.email_verified },
    });
  } catch (e) {
    console.error("GET /api/auth/me error:", e);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "名称不能为空" }, { status: 400 });
    }

    if (name.length > 50) {
      return NextResponse.json({ error: "名称不能超过 50 个字符" }, { status: 400 });
    }

    await query("UPDATE users SET name = ? WHERE id = ?", [name.trim(), userId]);

    const users = await query<{ id: string; email: string; name: string | null; email_verified: number }>(
      "SELECT id, email, name, email_verified FROM users WHERE id = ?",
      [userId],
    );

    const user = users[0];
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name ?? undefined, emailVerified: !!user.email_verified },
    });
  } catch (e) {
    console.error("PATCH /api/auth/me error:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
