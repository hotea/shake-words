import { NextRequest, NextResponse } from "next/server";
import { wordBookManager } from "@/data/wordbooks";
import { buildQuizQuestion } from "@/lib/adapter/shared";
import { getCurrentUserId } from "@/lib/auth/session";
import { MySqlAdapter } from "@/lib/adapter/mysql";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    await wordBookManager.getWords(bookId);

    const userId = await getCurrentUserId();
    let progressList: import("@/lib/types").WordProgress[] = [];
    if (userId) {
      const adapter = new MySqlAdapter(userId);
      progressList = await adapter.getProgress(bookId);
    }

    const question = buildQuizQuestion(bookId, progressList);
    return NextResponse.json(question);
  } catch (e) {
    console.error("GET /api/quiz error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
