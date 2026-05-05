import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

// POST /api/auth/logout
export async function POST() {
  const cookie = clearSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, unknown>);
  return response;
}
