import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const versionFilePath = path.join(process.cwd(), "version.json");
    const versionData = JSON.parse(fs.readFileSync(versionFilePath, "utf-8"));
    
    return NextResponse.json({
      version: versionData.version,
      buildTime: versionData.buildTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to read version:", error);
    return NextResponse.json(
      { version: "unknown", buildTime: "unknown", error: "Failed to read version" },
      { status: 500 }
    );
  }
}
