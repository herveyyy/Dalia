import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Graceful local handler for offline dev
  return NextResponse.json({ success: true, message: "Uploaded to local storage" });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: "Uploaded to local storage" });
}
