import { NextRequest, NextResponse } from "next/server";
import { createPresignedUploadUrl } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { parentType = "job_application", fileCategory = "document", fileName, mimeType, fileSize } = body;

    if (!fileName || !mimeType) {
      return NextResponse.json(
        { success: false, error: "fileName and mimeType are required" },
        { status: 400 }
      );
    }

    // Generate presigned upload URL
    const presignedData = await createPresignedUploadUrl({
      parentType,
      fileCategory,
      fileName,
      mimeType,
      fileSize: fileSize ? Number(fileSize) : undefined,
    });

    return NextResponse.json({
      success: true,
      ...presignedData,
    });
  } catch (error: any) {
    console.error("Presigned URL generation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate presigned upload URL" },
      { status: 500 }
    );
  }
}
