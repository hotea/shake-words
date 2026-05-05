import { NextRequest, NextResponse } from "next/server";
import { wordBookManager } from "@/data/wordbooks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const bookId = searchParams.get("bookId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    if (!bookId) {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    const words = await wordBookManager.getWords(bookId);
    return NextResponse.json(words.slice(offset, offset + limit));
  } catch (e) {
    console.error("GET /api/words error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
