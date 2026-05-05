import { NextRequest, NextResponse } from "next/server";
import { MySqlAdapter } from "@/lib/adapter/mysql";
import { getCurrentUserId } from "@/lib/auth/session";
import type { AnswerPayload } from "@/lib/types";

// POST /api/answer
// Body: AnswerPayload
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const answer: AnswerPayload = await request.json();
    const adapter = new MySqlAdapter(userId);
    await adapter.submitAnswer(answer);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/answer error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
