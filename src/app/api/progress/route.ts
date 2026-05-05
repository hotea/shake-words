import { NextRequest, NextResponse } from "next/server";
import { MySqlAdapter } from "@/lib/adapter/mysql";
import { getCurrentUserId } from "@/lib/auth/session";

// GET /api/progress?bookId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    const adapter = new MySqlAdapter(userId);
    const progress = await adapter.getProgress(bookId);
    return NextResponse.json(progress);
  } catch (e) {
    console.error("GET /api/progress error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
