import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";
import { getCurrentUserId } from "@/lib/auth/session";
import { createVerifyToken, isVerifyLinkSentRecently } from "@/lib/verify-token-cache";
import { sendVerifyLink } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const users = await query<{ email: string; email_verified: number }>(
      "SELECT email, email_verified FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const user = users[0];

    if (user.email_verified) {
      return NextResponse.json({ error: "邮箱已验证" }, { status: 400 });
    }

    if (isVerifyLinkSentRecently(userId)) {
      return NextResponse.json({ error: "发送过于频繁，请 60 秒后再试" }, { status: 429 });
    }

    const token = createVerifyToken(userId);

    const basePath = process.env.NEXT_BASE_PATH || "";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "localhost";
    const verifyUrl = `${protocol}://${host}${basePath}/api/auth/verify-email?token=${token}&uid=${userId}`;

    try {
      await sendVerifyLink(user.email, verifyUrl);
    } catch (emailErr) {
      console.error("Failed to send verify link:", emailErr);
      return NextResponse.json({ error: "邮件发送失败，请稍后重试" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "验证链接已发送到您的邮箱" });
  } catch (e) {
    console.error("POST /api/auth/verify-link error:", e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
