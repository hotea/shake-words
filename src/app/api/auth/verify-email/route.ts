import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";
import { verifyEmailToken } from "@/lib/verify-token-cache";
import { createSessionToken, setSessionCookie, getCurrentUserId } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const uid = searchParams.get("uid");

    if (!token || !uid) {
      return redirectResult(request, false, "链接无效");
    }

    if (!verifyEmailToken(uid, token)) {
      return redirectResult(request, false, "链接已过期或无效，请重新发送");
    }

    await query("UPDATE users SET email_verified = TRUE WHERE id = ?", [uid]);

    const currentUserId = await getCurrentUserId();
    if (currentUserId === uid) {
      const sessionToken = createSessionToken(uid);
      const cookie = setSessionCookie(sessionToken);
      const response = redirectResult(request, true, "邮箱验证成功！");
      response.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>);
      return response;
    }

    return redirectResult(request, true, "邮箱验证成功！请登录您的账号。");
  } catch (e) {
    console.error("GET /api/auth/verify-email error:", e);
    return redirectResult(request, false, "服务器错误");
  }
}

function redirectResult(request: NextRequest, success: boolean, message: string): NextResponse {
  const basePath = process.env.NEXT_BASE_PATH || "";
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "localhost";
  const url = `${protocol}://${host}${basePath}/account?verified=${success ? "1" : "0"}&msg=${encodeURIComponent(message)}`;
  return NextResponse.redirect(url);
}
