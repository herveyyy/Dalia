"use client";

import * as React from "react";
import {
  HiOutlineVideoCamera,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineArrowPath,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { UploadedFilePayload } from "../app/user/utils/actions";

interface FileUploaderProps {
  onFilesChange: (files: UploadedFilePayload[]) => void;
  disabled?: boolean;
}

interface UploadSlotState {
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

export function FileUploader({ onFilesChange, disabled }: FileUploaderProps) {
  const [videoSlot, setVideoSlot] = React.useState<UploadSlotState | null>(null);
  const [resumeSlot, setResumeSlot] = React.useState<UploadSlotState | null>(null);
  const [coverSlot, setCoverSlot] = React.useState<UploadSlotState | null>(null);

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

  const handleFileUpload = async (
    file: File,
    fileCategory: "video" | "resume" | "cover_letter",
    setSlot: React.Dispatch<React.SetStateAction<UploadSlotState | null>>
  ) => {
    // 1. Generate local preview for immediate feedback
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
      // 2. Request presigned upload URL from backend API
      const presignedRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentType: "job_application",
          fileCategory,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          fileSize: file.size,
        }),
      });

      const presignedJson = await presignedRes.json();
      if (!presignedJson.success || !presignedJson.uploadUrl) {
        throw new Error(presignedJson.error || "Failed to initialize secure upload");
      }

      setSlot((prev) => (prev ? { ...prev, progress: 40, fileKey: presignedJson.fileKey } : null));

      // 3. Upload file directly to S3 (or mock endpoint)
      const uploadRes = await fetch(presignedJson.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadRes.ok && uploadRes.status !== 200 && uploadRes.status !== 204) {
        throw new Error("Direct S3 upload failed. Please try again.");
      }

      setSlot((prev) =>
        prev
          ? {
              ...prev,
              uploading: false,
              uploaded: true,
              progress: 100,
              fileKey: presignedJson.fileKey,
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
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* 1. Self-Introduction Video Pitch Upload */}
      <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <HiOutlineVideoCamera className="size-4 text-primary" />
            <span>Video Introduction / Self-Pitch (Optional)</span>
          </label>
          <span className="text-[11px] font-semibold text-muted-foreground">MP4, WebM, MOV (Max 100MB)</span>
        </div>

        {videoSlot ? (
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineVideoCamera className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{videoSlot.fileName}</p>
                  <p className="text-[11px] text-muted-foreground">{formatBytes(videoSlot.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {videoSlot.uploading ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary animate-pulse">
                    <HiOutlineArrowPath className="size-3.5 animate-spin" />
                    Uploading...
                  </span>
                ) : videoSlot.uploaded ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <HiOutlineCheckCircle className="size-3.5" />
                    Ready
                  </span>
                ) : videoSlot.error ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
                    <HiOutlineExclamationCircle className="size-3.5" />
                    {videoSlot.error}
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setVideoSlot(null);
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }}
                  disabled={disabled}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove video"
                >
                  <HiOutlineTrash className="size-4" />
                </button>
              </div>
            </div>

            {/* Video preview player */}
            {videoSlot.previewUrl ? (
              <div className="pt-1 overflow-hidden rounded-lg border border-border/60 bg-black/40">
                <video
                  src={videoSlot.previewUrl}
                  controls
                  className="w-full max-h-48 rounded-lg object-contain bg-black"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, "video", setVideoSlot);
              }}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={disabled}
              className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg bg-card/60 hover:bg-accent/40 hover:border-primary/50 transition-all text-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <HiOutlineVideoCamera className="size-6 text-primary" />
              <span className="text-xs font-bold text-foreground">Click to upload video pitch</span>
              <span className="text-[11px] text-muted-foreground">Introduce yourself, your key background & why you're a great fit</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Resume / CV Upload */}
      <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <HiOutlineDocumentArrowUp className="size-4 text-primary" />
            <span>Resume / Curriculum Vitae</span>
          </label>
          <span className="text-[11px] font-semibold text-muted-foreground">PDF, DOCX, DOC (Max 25MB)</span>
        </div>

        {resumeSlot ? (
          <div className="rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HiOutlineDocumentText className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{resumeSlot.fileName}</p>
                <p className="text-[11px] text-muted-foreground">{formatBytes(resumeSlot.fileSize)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {resumeSlot.uploading ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary animate-pulse">
                  <HiOutlineArrowPath className="size-3.5 animate-spin" />
                  Uploading...
                </span>
              ) : resumeSlot.uploaded ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <HiOutlineCheckCircle className="size-3.5" />
                  Attached
                </span>
              ) : resumeSlot.error ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
                  <HiOutlineExclamationCircle className="size-3.5" />
                  {resumeSlot.error}
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setResumeSlot(null);
                  if (resumeInputRef.current) resumeInputRef.current.value = "";
                }}
                disabled={disabled}
                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Remove resume"
              >
                <HiOutlineTrash className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, "resume", setResumeSlot);
              }}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              disabled={disabled}
              className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-border rounded-lg bg-card/60 hover:bg-accent/40 hover:border-primary/50 transition-all cursor-pointer disabled:opacity-50"
            >
              <HiOutlineDocumentArrowUp className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Upload Resume PDF / DOCX</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Cover Letter Document Upload (Optional) */}
      <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <HiOutlineDocumentText className="size-4 text-primary" />
            <span>Cover Letter File (Optional)</span>
          </label>
          <span className="text-[11px] font-semibold text-muted-foreground">PDF, DOCX, TXT</span>
        </div>

        {coverSlot ? (
          <div className="rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HiOutlineDocumentText className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{coverSlot.fileName}</p>
                <p className="text-[11px] text-muted-foreground">{formatBytes(coverSlot.fileSize)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {coverSlot.uploading ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary animate-pulse">
                  <HiOutlineArrowPath className="size-3.5 animate-spin" />
                  Uploading...
                </span>
              ) : coverSlot.uploaded ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <HiOutlineCheckCircle className="size-3.5" />
                  Attached
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setCoverSlot(null);
                  if (coverInputRef.current) coverInputRef.current.value = "";
                }}
                disabled={disabled}
                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Remove cover letter"
              >
                <HiOutlineTrash className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={coverInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,text/plain"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, "cover_letter", setCoverSlot);
              }}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={disabled}
              className="w-full flex items-center justify-center gap-2 p-2.5 border border-dashed border-border rounded-lg bg-card/60 hover:bg-accent/40 hover:border-primary/50 transition-all cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <HiOutlineDocumentText className="size-4 text-primary" />
              <span>Attach Cover Letter Document</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
