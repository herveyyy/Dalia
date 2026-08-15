import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fileRecord, FileRecord, NewFileRecord } from "../schema/files/tables";
import { eq, and, desc } from "drizzle-orm";
import { logActivity } from "./audit";

export function getAwsConfig() {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-southeast-1";
  const bucket =
    process.env.AWS_S3_BUCKET ||
    process.env.S3_BUCKET ||
    process.env.AWS_BUCKET_NAME ||
    "dalia.docs.erp";

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY;

  return {
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
    hasCredentials: Boolean(accessKeyId && secretAccessKey),
  };
}

export function getS3Client(): S3Client | null {
  const config = getAwsConfig();
  if (!config.hasCredentials) {
    return null;
  }
  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId!,
      secretAccessKey: config.secretAccessKey!,
    },
  });
}

/**
 * Sanitize file name for S3 keys
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .replace(/_+/g, "_");
}

export interface PresignedUploadResult {
  uploadUrl: string;
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileCategory: string;
  fileSize?: number;
}

/**
 * Generate a presigned PUT URL for direct browser uploads to S3 with user-specific folder paths
 */
export async function createPresignedUploadUrl(params: {
  parentType: string;
  fileCategory: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  userId?: string;
}): Promise<PresignedUploadResult> {
  const cleanName = sanitizeFileName(params.fileName);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  const userFolder = params.userId && params.userId.trim() !== "" ? params.userId : "general";

  let fileKey = "";
  if (params.parentType === "job_application") {
    // Structure: job_application/{userId}/{fileCategory}/{timestamp}-{randomSuffix}-{cleanName}
    fileKey = `job_application/${userFolder}/${params.fileCategory}/${timestamp}-${randomSuffix}-${cleanName}`;
  } else if (params.parentType === "user") {
    // Structure: users/{userId}/{fileCategory}/{timestamp}-{randomSuffix}-{cleanName}
    fileKey = `users/${userFolder}/${params.fileCategory}/${timestamp}-${randomSuffix}-${cleanName}`;
  } else {
    fileKey = `uploads/${params.parentType}/${userFolder}/${params.fileCategory}/${timestamp}-${randomSuffix}-${cleanName}`;
  }

  const config = getAwsConfig();
  const client = getS3Client();

  if (client) {
    try {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: fileKey,
        ContentType: params.mimeType,
      });

      const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 }); // 15 minutes

      return {
        uploadUrl,
        fileKey,
        fileName: params.fileName,
        mimeType: params.mimeType,
        fileCategory: params.fileCategory,
        fileSize: params.fileSize,
      };
    } catch (error) {
      console.warn("Failed to generate AWS S3 presigned upload URL, using fallback URL:", error);
    }
  }

  // Fallback if AWS credentials not configured or offline
  return {
    uploadUrl: `/api/upload/mock?key=${encodeURIComponent(fileKey)}`,
    fileKey,
    fileName: params.fileName,
    mimeType: params.mimeType,
    fileCategory: params.fileCategory,
    fileSize: params.fileSize,
  };
}

/**
 * Generic handler to check if a file's presigned URL is expired; if expired, refetches and updates DB
 */
export async function getOrRefreshPresignedUrl(
  dbInstance: any,
  file: FileRecord,
  expiresInSeconds: number = 3600 // 1 hour default
): Promise<string> {
  const safetyThresholdMs = 5 * 60 * 1000; // 5 minutes buffer

  if (file.presignedUrl && file.presignedUrlExpiresAt) {
    const expiresAtTime = new Date(file.presignedUrlExpiresAt).getTime();
    if (expiresAtTime - Date.now() > safetyThresholdMs) {
      return file.presignedUrl;
    }
  }

  // URL is expired or not set, generate fresh S3 presigned GET URL
  let freshUrl = file.presignedUrl || "";
  const client = getS3Client();
  const config = getAwsConfig();

  if (client) {
    try {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: file.fileKey,
      });

      freshUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
    } catch (err) {
      console.warn(`Could not generate presigned download URL for key: ${file.fileKey}`, err);
    }
  }

  if (!freshUrl) {
    freshUrl = file.fileKey.startsWith("http")
      ? file.fileKey
      : `/api/files/download?key=${encodeURIComponent(file.fileKey)}`;
  }

  const newExpiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

  try {
    await dbInstance
      .update(fileRecord)
      .set({
        presignedUrl: freshUrl,
        presignedUrlExpiresAt: newExpiresAt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(fileRecord.id, file.id));
  } catch (dbErr) {
    console.error("Failed to update cached presigned URL in DB:", dbErr);
  }

  return freshUrl;
}

/**
 * Fetch all files attached to a parent entity (e.g. job_application, user) with active fresh URLs
 */
export async function getFilesWithFreshUrlsByParent(
  dbInstance: any,
  parentId: string,
  parentType?: string
): Promise<Array<FileRecord & { activeUrl: string }>> {
  const conditions = [eq(fileRecord.parentId, parentId)];
  if (parentType) {
    conditions.push(eq(fileRecord.parentType, parentType));
  }

  const files = await dbInstance
    .select()
    .from(fileRecord)
    .where(and(...conditions))
    .orderBy(desc(fileRecord.createdAt));

  const results = await Promise.all(
    files.map(async (f: FileRecord) => {
      const activeUrl = await getOrRefreshPresignedUrl(dbInstance, f);
      return {
        ...f,
        activeUrl,
      };
    })
  );

  return results;
}

/**
 * Save a new file record in the database, generates initial presigned URL, and logs activity
 */
export async function saveFileRecord(
  dbInstance: any,
  data: {
    parentId: string;
    parentType: string;
    fileCategory: string;
    fileName: string;
    fileKey: string;
    mimeType?: string;
    fileSize?: number;
    metadata?: Record<string, any>;
    companyId?: string | null;
    actorId?: string | null;
    actorName?: string | null;
    actorEmail?: string | null;
  }
): Promise<FileRecord> {
  const expiresInSeconds = 86400; // 24 hours initial
  let initialPresignedUrl: string | null = null;
  const client = getS3Client();
  const config = getAwsConfig();

  if (client) {
    try {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: data.fileKey,
      });
      initialPresignedUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
    } catch (err) {
      console.warn("Initial presigned download URL generation skipped/fallback:", err);
    }
  }

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

  const [inserted] = await dbInstance
    .insert(fileRecord)
    .values({
      parentId: data.parentId,
      parentType: data.parentType,
      fileCategory: data.fileCategory,
      fileName: data.fileName,
      fileKey: data.fileKey,
      mimeType: data.mimeType || null,
      fileSize: data.fileSize || null,
      presignedUrl: initialPresignedUrl,
      presignedUrlExpiresAt: initialPresignedUrl ? expiresAt : null,
      metadata: data.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  // Activity Log Integration
  if (inserted) {
    await logActivity(dbInstance, {
      companyId: data.companyId || null,
      actorId: data.actorId || null,
      actorName: data.actorName || null,
      actorEmail: data.actorEmail || null,
      entityType: "file",
      entityId: inserted.id,
      action: "UPLOAD",
      summary: `Uploaded ${data.fileCategory} file "${data.fileName}" for ${data.parentType} (${data.parentId})`,
      newData: inserted,
      metadata: {
        parentId: data.parentId,
        parentType: data.parentType,
        fileCategory: data.fileCategory,
        fileName: data.fileName,
        fileSize: data.fileSize,
      },
    });
  }

  return inserted;
}
