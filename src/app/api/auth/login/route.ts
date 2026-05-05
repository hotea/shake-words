import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db/mysql";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { getAndClearEmailCode } from "@/lib/email-code-cache";

export async function POST(request: NextRequest) {
  try {
    const { email, password, emailCode } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "请输入邮箱" }, { status: 400 });
    }

    if (emailCode) {
      const cached = getAndClearEmailCode(email);
      if (!cached) {
        return NextResponse.json({ error: "验证码已过期，请重新获取" }, { status: 401 });
      }
      if (cached !== emailCode) {
        return NextResponse.json({ error: "验证码不正确" }, { status: 401 });
      }

      const users = await query<{ id: string; email: string; name: string | null }>(
        "SELECT id, email, name FROM users WHERE email = ?",
        [email.toLowerCase()],
      );

      if (users.length === 0) {
        return NextResponse.json({ error: "该邮箱未注册" }, { status: 401 });
      }

      const user = users[0];

      await query(
        "UPDATE users SET email_verified = TRUE WHERE id = ?",
        [user.id],
      );

      const token = createSessionToken(user.id);
      const cookie = setSessionCookie(token);

      const response = NextResponse.json({
        ok: true,
        user: { id: user.id, email: user.email, name: user.name ?? undefined, emailVerified: true },
      });
      response.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>);
      return response;
    }

    if (!password) {
      return NextResponse.json({ error: "请输入密码" }, { status: 400 });
    }

    const users = await query<{ id: string; email: string; password: string; name: string | null; email_verified: number }>(
      "SELECT id, email, password, name, email_verified FROM users WHERE email = ?",
      [email.toLowerCase()],
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }

    if (!user.email_verified) {
      return NextResponse.json({ error: "邮箱未验证，请使用验证码登录" }, { status: 403 });
    }

    const token = createSessionToken(user.id);
    const cookie = setSessionCookie(token);

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name ?? undefined, emailVerified: true },
    });
    response.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>);
    return response;
  } catch (e) {
    console.error("POST /api/auth/login error:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
