import { NextRequest, NextResponse } from "next/server";
import { heartbeat, getOnlineStats } from "@/lib/online-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId } = body;

    if (!visitorId || typeof visitorId !== "string") {
      return NextResponse.json(
        { error: "Invalid visitorId" },
        { status: 400 }
      );
    }

    const stats = await heartbeat(visitorId);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = getOnlineStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
