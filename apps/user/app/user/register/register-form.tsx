"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
  HiOutlineLink,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import { FileUploader } from "../../../components/file-uploader";
import {
  registerAndApplyAction,
  applyForJobAction,
} from "../utils/actions";
import type { UploadedFilePayload } from "../utils/queries";
import { FileRecord } from "@repo/db";

interface RegisterFormProps {
  jobId: string;
  error?: string;
  currentUser?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  defaultFiles?: FileRecord[];
}

export function RegisterForm({ jobId, error, currentUser, defaultFiles }: RegisterFormProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFilePayload[]>([]);
  const [coverLetter, setCoverLetter] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(error || null);

  const formattedInitialFiles = React.useMemo(() => {
    if (!defaultFiles || defaultFiles.length === 0) return [];
    return defaultFiles.map((f) => ({
      fileCategory: (f.fileCategory as "video" | "resume" | "cover_letter") || "resume",
      fileName: f.fileName,
      fileKey: f.fileKey,
      mimeType: f.mimeType || undefined,
      fileSize: f.fileSize || undefined,
      previewUrl: f.presignedUrl || undefined,
    }));
  }, [defaultFiles]);

  const handleLoggedInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setFormError(null);

    const res = await applyForJobAction({
      jobPostingId: jobId,
      coverLetter,
      resumeUrl,
      files: uploadedFiles,
    });

    if (res.success) {
      router.push("/user/applications?applied=true");
    } else {
      setFormError(res.error || "Failed to submit job application.");
      setIsSubmitting(false);
    }
  };

  const displayError = formError || error;

  return (
    <form
      action={!currentUser ? registerAndApplyAction : undefined}
      onSubmit={currentUser ? handleLoggedInSubmit : () => setIsSubmitting(true)}
      className="space-y-6"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="files" value={JSON.stringify(uploadedFiles)} />

      {displayError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center gap-3">
          <HiOutlineExclamationTriangle className="size-5 shrink-0" />
          <p className="font-medium">{displayError}</p>
        </div>
      ) : null}

      {/* Section 1: Candidate Account Profile */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            1
          </span>
          <h3 className="text-sm font-bold text-foreground">
            {currentUser ? "Candidate Profile" : "Candidate Information & Account Setup"}
          </h3>
        </div>

        {currentUser ? (
          /* Logged In Candidate Badge — Hides password & redundant inputs */
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs">
                {currentUser.name ? currentUser.name[0]?.toUpperCase() : <HiOutlineUser className="size-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {currentUser.name || "Logged-in Candidate"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
              <HiOutlineCheckCircle className="size-3.5" />
              <span>Signed In</span>
            </span>
          </div>
        ) : (
          /* Registration Form Fields for New Visitors */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="name" className="text-xs font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <HiOutlineUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Alex Morgan"
                  required
                  className="pl-11 h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  required
                  className="pl-11 h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Create Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  className="pl-11 h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Application Media & Documents */}
      <div className="space-y-4 pt-2 border-t border-border/60">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            2
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Application Media & Documents
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Attach your self-introduction video pitch, resume PDF, and optional cover letter.
            </p>
          </div>
        </div>

        <FileUploader
          onFilesChange={setUploadedFiles}
          disabled={isSubmitting}
          initialFiles={formattedInitialFiles}
          userId={currentUser?.id}
        />
      </div>

      {/* Section 3: Notes & Portfolio Links */}
      <div className="space-y-4 pt-2 border-t border-border/60">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            3
          </span>
          <h3 className="text-sm font-bold text-foreground">
            Additional Links & Cover Note (Optional)
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coverLetter" className="text-xs font-semibold flex items-center gap-1.5">
              <HiOutlineChatBubbleBottomCenterText className="size-3.5 text-primary" />
              <span>Cover Note / Introduction</span>
            </Label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce your key qualifications, relevant background, or a personal message to the hiring team..."
              className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="resumeUrl" className="text-xs font-semibold flex items-center gap-1.5">
              <HiOutlineLink className="size-3.5 text-primary" />
              <span>Online Portfolio / LinkedIn URL</span>
            </Label>
            <Input
              id="resumeUrl"
              name="resumeUrl"
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile or https://github.com/..."
              className="h-10 text-xs rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={isSubmitting}
          className="w-full h-12 font-bold gap-2 text-sm shadow-md hover:shadow-lg transition-all rounded-xl cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting Application...</span>
          ) : currentUser ? (
            <>
              <HiOutlineSparkles className="size-4" />
              <span>Submit Job Application</span>
              <HiOutlineArrowRight className="size-4" />
            </>
          ) : (
            <>
              <HiOutlineSparkles className="size-4" />
              <span>Complete Registration & Submit Application</span>
              <HiOutlineArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
