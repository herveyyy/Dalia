"use client";

import * as React from "react";
import {
  HiOutlineDocumentCheck,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowUpTray,
  HiOutlineDocumentText,
  HiOutlineVideoCamera,
  HiOutlineTrash,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { FileUploader } from "../../../components/file-uploader";
import { saveUserDefaultMaterialsAction, deleteUserFileAction } from "../utils/actions";
import type { UploadedFilePayload } from "../utils/queries";
import { FileRecord } from "@repo/db";

interface ProfileMaterialsFormProps {
  initialFiles: FileRecord[];
  userId?: string;
}

export function ProfileMaterialsForm({ initialFiles, userId }: ProfileMaterialsFormProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFilePayload[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Format initial files for FileUploader
  const formattedInitialFiles = React.useMemo(() => {
    return initialFiles.map((f) => ({
      fileCategory: (f.fileCategory as "video" | "resume" | "cover_letter") || "resume",
      fileName: f.fileName,
      fileKey: f.fileKey,
      mimeType: f.mimeType || undefined,
      fileSize: f.fileSize || undefined,
      previewUrl: f.presignedUrl || undefined,
    }));
  }, [initialFiles]);

  const handleSaveDefaults = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const res = await saveUserDefaultMaterialsAction({
      files: uploadedFiles,
    });

    if (res.success) {
      setSuccessMessage("Your default application materials have been updated successfully!");
    } else {
      setErrorMessage(res.error || "Failed to save default materials.");
    }
    setIsSaving(false);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to remove this default file?")) return;
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const res = await deleteUserFileAction(fileId);
    if (res.success) {
      setSuccessMessage("File removed from your default profile materials.");
    } else {
      setErrorMessage(res.error || "Failed to delete file.");
    }
    setIsSaving(false);
  };

  const defaultVideo = initialFiles.find((f) => f.fileCategory === "video");
  const defaultResume = initialFiles.find((f) => f.fileCategory === "resume");
  const defaultCover = initialFiles.find((f) => f.fileCategory === "cover_letter");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <HiOutlineDocumentCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Default Application Materials</h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                <HiOutlineSparkles className="size-3" />
                Auto-Fill Enabled
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set up your primary resume, self-intro video pitch, and cover letter. They will automatically pre-fill whenever you apply for any job!
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 flex items-center gap-3">
          <HiOutlineCheckCircle className="size-5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-semibold text-destructive flex items-center gap-3">
          <HiOutlineExclamationTriangle className="size-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      {/* Currently Saved Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Video Pitch Badge */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${defaultVideo ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
              <HiOutlineVideoCamera className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground">Default Video Pitch</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {defaultVideo ? defaultVideo.fileName : "Not set"}
              </p>
            </div>
          </div>
          {defaultVideo?.presignedUrl ? (
            <a
              href={defaultVideo.presignedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 shrink-0 p-1 hover:bg-primary/10 rounded-md transition-colors"
              title="Preview Video"
            >
              <HiOutlineArrowTopRightOnSquare className="size-4" />
            </a>
          ) : null}
        </div>

        {/* Resume Document Badge */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${defaultResume ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
              <HiOutlineDocumentText className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground">Default Resume / CV</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {defaultResume ? defaultResume.fileName : "Not set"}
              </p>
            </div>
          </div>
          {defaultResume?.presignedUrl ? (
            <a
              href={defaultResume.presignedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 shrink-0 p-1 hover:bg-primary/10 rounded-md transition-colors"
              title="View Resume"
            >
              <HiOutlineArrowTopRightOnSquare className="size-4" />
            </a>
          ) : null}
        </div>

        {/* Cover Letter Badge */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${defaultCover ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
              <HiOutlineDocumentText className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-foreground">Default Cover Letter</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {defaultCover ? defaultCover.fileName : "Not set"}
              </p>
            </div>
          </div>
          {defaultCover?.presignedUrl ? (
            <a
              href={defaultCover.presignedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 shrink-0 p-1 hover:bg-primary/10 rounded-md transition-colors"
              title="View Cover Letter"
            >
              <HiOutlineArrowTopRightOnSquare className="size-4" />
            </a>
          ) : null}
        </div>
      </div>

      {/* File Upload Zone */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <p className="text-xs font-semibold text-foreground">
          Upload or update your default materials:
        </p>
        <FileUploader
          parentType="user"
          userId={userId}
          initialFiles={formattedInitialFiles}
          onFilesChange={setUploadedFiles}
          disabled={isSaving}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={handleSaveDefaults}
          disabled={isSaving || uploadedFiles.length === 0}
          variant="default"
          size="default"
          className="font-bold gap-2 px-6 h-11 rounded-xl shadow-sm cursor-pointer"
        >
          {isSaving ? (
            <span>Saving Default Materials...</span>
          ) : (
            <>
              <HiOutlineArrowUpTray className="size-4" />
              <span>Save Default Materials</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
