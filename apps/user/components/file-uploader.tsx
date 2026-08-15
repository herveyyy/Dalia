"use client";

import * as React from "react";
import {
  HiOutlineVideoCamera,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiOutlineCloudArrowUp,
} from "react-icons/hi2";
import { UploadedFilePayload } from "../app/user/utils/actions";
import { useFileUploader, InitialFileItem } from "./file-uploader.hooks";

interface FileUploaderProps {
  onFilesChange: (files: UploadedFilePayload[]) => void;
  disabled?: boolean;
  parentType?: string;
  initialFiles?: InitialFileItem[];
  userId?: string;
}

export function FileUploader({
  onFilesChange,
  disabled,
  parentType = "job_application",
  initialFiles = [],
  userId,
}: FileUploaderProps) {
  const {
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
  } = useFileUploader({ onFilesChange, parentType, initialFiles, userId });

  return (
    <div className="space-y-4">
      {/* 1. Self-Introduction Video Pitch Upload */}
      <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <HiOutlineVideoCamera className="size-4 text-primary" />
            <span>Video Introduction / Self-Pitch (Optional)</span>
          </label>
          <span className="text-[11px] font-semibold text-muted-foreground">MP4, WebM, MOV (Max 100MB)</span>
        </div>

        {videoSlot ? (
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HiOutlineVideoCamera className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{videoSlot.fileName}</p>
                  <p className="text-[11px] text-muted-foreground">{formatBytes(videoSlot.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {videoSlot.uploading ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary animate-pulse bg-primary/10 px-2.5 py-1 rounded-lg">
                    <HiOutlineArrowPath className="size-3.5 animate-spin" />
                    Uploading...
                  </span>
                ) : videoSlot.uploaded ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <HiOutlineCheckCircle className="size-3.5" />
                    Ready
                  </span>
                ) : videoSlot.error ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg">
                    <HiOutlineExclamationCircle className="size-3.5" />
                    {videoSlot.error}
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={removeVideoSlot}
                  disabled={disabled}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  title="Remove video"
                >
                  <HiOutlineTrash className="size-4" />
                </button>
              </div>
            </div>

            {/* Video preview player */}
            {videoSlot.previewUrl ? (
              <div className="overflow-hidden rounded-xl border border-border/80 bg-black/60 shadow-inner">
                <video
                  src={videoSlot.previewUrl}
                  controls
                  className="w-full max-h-56 rounded-xl object-contain bg-black"
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
                if (file) uploadVideo(file);
              }}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={disabled}
              className="w-full flex flex-col sm:flex-row items-center justify-center p-4 border border-dashed border-border rounded-xl bg-card hover:bg-accent/40 hover:border-primary/50 transition-all text-center sm:text-left gap-3 cursor-pointer disabled:opacity-50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HiOutlineCloudArrowUp className="size-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">Click to upload video introduction pitch</span>
                <span className="text-[11px] text-muted-foreground block">Brief 30-60 second video explaining why you are the ideal fit for this role</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 2 & 3. Resume & Cover Letter Documents in 2-Column Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume / CV Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <HiOutlineDocumentArrowUp className="size-4 text-primary" />
              <span>Resume / CV</span>
            </label>
            <span className="text-[10px] font-semibold text-muted-foreground">PDF, DOCX (25MB)</span>
          </div>

          {resumeSlot ? (
            <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineDocumentText className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{resumeSlot.fileName}</p>
                  <p className="text-[10px] text-muted-foreground">{formatBytes(resumeSlot.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {resumeSlot.uploading ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary animate-pulse">
                    <HiOutlineArrowPath className="size-3 animate-spin" />
                    Uploading...
                  </span>
                ) : resumeSlot.uploaded ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <HiOutlineCheckCircle className="size-3" />
                    Attached
                  </span>
                ) : resumeSlot.error ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-destructive">
                    <HiOutlineExclamationCircle className="size-3" />
                    {resumeSlot.error}
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={removeResumeSlot}
                  disabled={disabled}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  title="Remove resume"
                >
                  <HiOutlineTrash className="size-3.5" />
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
                  if (file) uploadResume(file);
                }}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2 p-3.5 border border-dashed border-border rounded-xl bg-card hover:bg-accent/40 hover:border-primary/50 transition-all cursor-pointer disabled:opacity-50 text-xs font-semibold text-foreground shadow-xs"
              >
                <HiOutlineDocumentArrowUp className="size-4 text-primary" />
                <span>Upload Resume PDF / DOCX</span>
              </button>
            </div>
          )}
        </div>

        {/* Cover Letter Document Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <HiOutlineDocumentText className="size-4 text-primary" />
              <span>Cover Letter File</span>
            </label>
            <span className="text-[10px] font-semibold text-muted-foreground">PDF, DOCX, TXT</span>
          </div>

          {coverSlot ? (
            <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineDocumentText className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{coverSlot.fileName}</p>
                  <p className="text-[10px] text-muted-foreground">{formatBytes(coverSlot.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {coverSlot.uploading ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary animate-pulse">
                    <HiOutlineArrowPath className="size-3 animate-spin" />
                    Uploading...
                  </span>
                ) : coverSlot.uploaded ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <HiOutlineCheckCircle className="size-3" />
                    Attached
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={removeCoverSlot}
                  disabled={disabled}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  title="Remove cover letter"
                >
                  <HiOutlineTrash className="size-3.5" />
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
                  if (file) uploadCover(file);
                }}
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2 p-3.5 border border-dashed border-border rounded-xl bg-card hover:bg-accent/40 hover:border-primary/50 transition-all cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50 shadow-xs"
              >
                <HiOutlineDocumentText className="size-4 text-primary" />
                <span>Attach Cover Letter Doc</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
