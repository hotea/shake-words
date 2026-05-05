import { NextRequest, NextResponse } from "next/server";
import { MySqlAdapter } from "@/lib/adapter/mysql";
import { getCurrentUserId } from "@/lib/auth/session";

// GET /api/stats?bookId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const bookId = searchParams.get("bookId") || undefined;

    const adapter = new MySqlAdapter(userId);
    const stats = await adapter.getStats(bookId);
    return NextResponse.json(stats);
  } catch (e) {
    console.error("GET /api/stats error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
