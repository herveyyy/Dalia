"use client";

import * as React from "react";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import { FileUploader } from "../../../components/file-uploader";
import { UploadedFilePayload, registerAndApplyAction } from "../utils/actions";

interface RegisterFormProps {
  jobId: string;
  error?: string;
}

export function RegisterForm({ jobId, error }: RegisterFormProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFilePayload[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <form
      action={registerAndApplyAction}
      onSubmit={() => setIsSubmitting(true)}
      className="space-y-4"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="files" value={JSON.stringify(uploadedFiles)} />

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2.5">
          <HiOutlineExclamationTriangle className="size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <HiOutlineUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Alex Morgan"
            required
            className="pl-11 h-10 text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="alex@example.com"
            required
            className="pl-11 h-10 text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Create Password</Label>
        <div className="relative">
          <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
            className="pl-11 h-10 text-xs"
          />
        </div>
      </div>

      {/* Video, Resume & Cover Letter Uploads */}
      <div className="pt-2">
        <FileUploader onFilesChange={setUploadedFiles} disabled={isSubmitting} />
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Label htmlFor="coverLetter">Cover Letter Note (Optional)</Label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={3}
          placeholder="Introduce yourself to the hiring team..."
          className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="resumeUrl">Portfolio / LinkedIn URL (Optional)</Label>
        <Input
          id="resumeUrl"
          name="resumeUrl"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          className="h-10 text-xs"
        />
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={isSubmitting}
        className="w-full font-bold gap-2 text-xs mt-2"
      >
        <span>{isSubmitting ? "Submitting Application..." : "Register & Submit Application"}</span>
        <HiOutlineArrowRight className="size-4" />
      </Button>
    </form>
  );
}
