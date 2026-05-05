import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { query } from "@/lib/db/mysql";
import { setEmailCode } from "@/lib/email-code-cache";
import { sendVerificationCode } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱地址格式不正确" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少需要 6 位字符" }, { status: 400 });
    }

    const existing = await query<{ id: string }>(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase()],
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "该邮箱已注册，请直接登录" }, { status: 409 });
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString().slice(0, 23).replace("T", " ");

    await query(
      "INSERT INTO users (id, email, password, name, email_verified, created_at) VALUES (?, ?, ?, ?, FALSE, ?)",
      [userId, email.toLowerCase(), hashedPassword, email.split("@")[0], now],
    );

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setEmailCode(email.toLowerCase(), code);

    try {
      await sendVerificationCode(email.toLowerCase(), code);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
    }

    return NextResponse.json({
      ok: true,
      message: "注册成功，验证码已发送到您的邮箱，请使用验证码登录",
    });
  } catch (e) {
    console.error("POST /api/auth/signup error:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
