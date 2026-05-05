import { NextResponse } from "next/server";
import { wordBookManager } from "@/data/wordbooks";

export async function GET() {
  try {
    const books = wordBookManager.getAllBooks();
    return NextResponse.json(books);
  } catch (e) {
    console.error("GET /api/wordbooks error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
