import { NextRequest, NextResponse } from "next/server";
import { MySqlAdapter } from "@/lib/adapter/mysql";
import { getCurrentUserId } from "@/lib/auth/session";

// GET /api/records?bookId=xxx&limit=100
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const bookId = searchParams.get("bookId") || undefined;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const adapter = new MySqlAdapter(userId);
    const records = await adapter.getRecords(bookId, limit);
    return NextResponse.json(records);
  } catch (e) {
    console.error("GET /api/records error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
