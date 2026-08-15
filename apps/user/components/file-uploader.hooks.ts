"use client";

import * as React from "react";
import { getPresignedUploadUrlAction } from "../app/user/utils/actions";
import type { UploadedFilePayload } from "../app/user/utils/queries";

export interface UploadSlotState {
  file: File | null;
  fileCategory: "video" | "resume" | "cover_letter";
  fileName: string;
  fileKey: string;
  mimeType: string;
  fileSize: number;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error: string | null;
  previewUrl: string | null;
}

export interface InitialFileItem {
  fileCategory: "video" | "resume" | "cover_letter";
  fileName: string;
  fileKey: string;
  mimeType?: string;
  fileSize?: number;
  previewUrl?: string | null;
}

export interface UseFileUploaderProps {
  onFilesChange: (files: UploadedFilePayload[]) => void;
  parentType?: string;
  initialFiles?: InitialFileItem[];
  userId?: string;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function useFileUploader({
  onFilesChange,
  parentType = "job_application",
  initialFiles = [],
  userId,
}: UseFileUploaderProps) {
  const initVideo = initialFiles.find((f) => f.fileCategory === "video");
  const initResume = initialFiles.find((f) => f.fileCategory === "resume");
  const initCover = initialFiles.find((f) => f.fileCategory === "cover_letter");

  const [videoSlot, setVideoSlot] = React.useState<UploadSlotState | null>(
    initVideo
      ? {
          file: null,
          fileCategory: "video",
          fileName: initVideo.fileName,
          fileKey: initVideo.fileKey,
          mimeType: initVideo.mimeType || "video/mp4",
          fileSize: initVideo.fileSize || 0,
          uploading: false,
          progress: 100,
          uploaded: true,
          error: null,
          previewUrl: initVideo.previewUrl || null,
        }
      : null
  );

  const [resumeSlot, setResumeSlot] = React.useState<UploadSlotState | null>(
    initResume
      ? {
          file: null,
          fileCategory: "resume",
          fileName: initResume.fileName,
          fileKey: initResume.fileKey,
          mimeType: initResume.mimeType || "application/pdf",
          fileSize: initResume.fileSize || 0,
          uploading: false,
          progress: 100,
          uploaded: true,
          error: null,
          previewUrl: initResume.previewUrl || null,
        }
      : null
  );

  const [coverSlot, setCoverSlot] = React.useState<UploadSlotState | null>(
    initCover
      ? {
          file: null,
          fileCategory: "cover_letter",
          fileName: initCover.fileName,
          fileKey: initCover.fileKey,
          mimeType: initCover.mimeType || "application/pdf",
          fileSize: initCover.fileSize || 0,
          uploading: false,
          progress: 100,
          uploaded: true,
          error: null,
          previewUrl: initCover.previewUrl || null,
        }
      : null
  );

  const videoInputRef = React.useRef<HTMLInputElement | null>(null);
  const resumeInputRef = React.useRef<HTMLInputElement | null>(null);
  const coverInputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync uploaded files with parent whenever slots change
  React.useEffect(() => {
    const payload: UploadedFilePayload[] = [];
    if (videoSlot?.uploaded && videoSlot.fileKey) {
      payload.push({
        fileCategory: "video",
        fileName: videoSlot.fileName,
        fileKey: videoSlot.fileKey,
        mimeType: videoSlot.mimeType,
        fileSize: videoSlot.fileSize,
        metadata: { category: "self_intro_video" },
      });
    }
    if (resumeSlot?.uploaded && resumeSlot.fileKey) {
      payload.push({
        fileCategory: "resume",
        fileName: resumeSlot.fileName,
        fileKey: resumeSlot.fileKey,
        mimeType: resumeSlot.mimeType,
        fileSize: resumeSlot.fileSize,
        metadata: { category: "resume_cv" },
      });
    }
    if (coverSlot?.uploaded && coverSlot.fileKey) {
      payload.push({
        fileCategory: "cover_letter",
        fileName: coverSlot.fileName,
        fileKey: coverSlot.fileKey,
        mimeType: coverSlot.mimeType,
        fileSize: coverSlot.fileSize,
        metadata: { category: "cover_letter_doc" },
      });
    }
    onFilesChange(payload);
  }, [videoSlot, resumeSlot, coverSlot, onFilesChange]);

  const handleFileUpload = React.useCallback(
    async (
      file: File,
      fileCategory: "video" | "resume" | "cover_letter",
      setSlot: React.Dispatch<React.SetStateAction<UploadSlotState | null>>
    ) => {
      // 1. Generate local preview URL
      const previewUrl = URL.createObjectURL(file);
      const initialSlot: UploadSlotState = {
        file,
        fileCategory,
        fileName: file.name,
        fileKey: "",
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        uploading: true,
        progress: 10,
        uploaded: false,
        error: null,
        previewUrl,
      };
      setSlot(initialSlot);

      try {
        // 2. Request presigned upload URL directly via Server Action
        const presignedRes = await getPresignedUploadUrlAction({
          parentType,
          fileCategory,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          fileSize: file.size,
          userId,
        });

        if (!presignedRes.success) {
          throw new Error(presignedRes.error || "Failed to initialize secure upload");
        }

        setSlot((prev) => (prev ? { ...prev, progress: 40, fileKey: presignedRes.fileKey } : null));

        // 3. Upload file directly to S3 if external URL
        if (presignedRes.uploadUrl && presignedRes.uploadUrl.startsWith("http")) {
          try {
            const uploadRes = await fetch(presignedRes.uploadUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type || "application/octet-stream",
              },
              body: file,
            });

            if (!uploadRes.ok && uploadRes.status !== 200 && uploadRes.status !== 204) {
              throw new Error(`Direct S3 upload failed (HTTP ${uploadRes.status})`);
            }
          } catch (fetchError) {
            console.warn(
              "Direct browser upload failed (possibly S3 CORS block). Attempting server-side upload proxy fallback...",
              fetchError
            );

            const fallbackFormData = new FormData();
            fallbackFormData.append("file", file);
            fallbackFormData.append("fileKey", presignedRes.fileKey);

            const fallbackRes = await fetch("/user/api/files/upload", {
              method: "POST",
              body: fallbackFormData,
            });

            if (!fallbackRes.ok) {
              const errorText = await fallbackRes.text();
              throw new Error(`Fallback upload failed: ${errorText || fallbackRes.statusText}`);
            }
          }
        }

        setSlot((prev) =>
          prev
            ? {
                ...prev,
                uploading: false,
                uploaded: true,
                progress: 100,
                fileKey: presignedRes.fileKey,
              }
            : null
        );
      } catch (err: any) {
        console.error("Upload error:", err);
        setSlot((prev) =>
          prev
            ? {
                ...prev,
                uploading: false,
                uploaded: false,
                error: err?.message || "Upload failed. Try again.",
              }
            : null
        );
      }
    },
    [parentType]
  );

  const removeVideoSlot = React.useCallback(() => {
    setVideoSlot(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  }, []);

  const removeResumeSlot = React.useCallback(() => {
    setResumeSlot(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  }, []);

  const removeCoverSlot = React.useCallback(() => {
    setCoverSlot(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }, []);

  const uploadVideo = React.useCallback(
    (file: File) => handleFileUpload(file, "video", setVideoSlot),
    [handleFileUpload]
  );

  const uploadResume = React.useCallback(
    (file: File) => handleFileUpload(file, "resume", setResumeSlot),
    [handleFileUpload]
  );

  const uploadCover = React.useCallback(
    (file: File) => handleFileUpload(file, "cover_letter", setCoverSlot),
    [handleFileUpload]
  );

  return {
    videoSlot,
    resumeSlot,
    coverSlot,
    videoInputRef,
    resumeInputRef,
    coverInputRef,
    uploadVideo,
    uploadResume,
    uploadCover,
    removeVideoSlot,
    removeResumeSlot,
    removeCoverSlot,
    formatBytes,
  };
}
