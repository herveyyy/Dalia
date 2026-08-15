"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiOutlineCamera, HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { getPresignedUploadUrlAction, updateProfileImageAction } from "../utils/actions";

interface ProfileAvatarProps {
  userId: string;
  initials: string;
  imageUrl?: string | null;
}

export function ProfileAvatar({ userId, initials, imageUrl }: ProfileAvatarProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAvatarClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verify size & type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Get presigned upload URL
      const presignedRes = await getPresignedUploadUrlAction({
        parentType: "user",
        fileCategory: "profile_image",
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        userId,
      });

      if (!presignedRes.success) {
        throw new Error(presignedRes.error || "Failed to initialize upload");
      }

      // 2. Upload file (direct S3 with server fallback proxy)
      let uploadSuccess = false;
      if (presignedRes.uploadUrl && presignedRes.uploadUrl.startsWith("http")) {
        try {
          const uploadRes = await fetch(presignedRes.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });
          if (uploadRes.ok || uploadRes.status === 200 || uploadRes.status === 204) {
            uploadSuccess = true;
          }
        } catch (fetchError) {
          console.warn("Direct avatar upload failed (CORS), trying proxy...", fetchError);
        }
      }

      if (!uploadSuccess) {
        // Fallback upload to Next.js API route
        const fallbackFormData = new FormData();
        fallbackFormData.append("file", file);
        fallbackFormData.append("fileKey", presignedRes.fileKey);

        const fallbackRes = await fetch("/user/api/files/upload", {
          method: "POST",
          body: fallbackFormData,
        });

        if (!fallbackRes.ok) {
          throw new Error("Failed to upload profile image via proxy.");
        }
      }

      // 3. Save the image key/URL to user profile record
      // We will store the public/downloadable URL or just the fileKey. Let's use download api fallback or full URL.
      const avatarUrl = `/user/api/files/download?key=${encodeURIComponent(presignedRes.fileKey)}`;
      
      const saveRes = await updateProfileImageAction(avatarUrl);
      if (!saveRes.success) {
        throw new Error(saveRes.error || "Failed to update profile record");
      }

      router.refresh();
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleAvatarClick}
        className="relative group size-20 rounded-full cursor-pointer overflow-hidden border border-border/80 bg-primary/10 shadow-sm flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:shadow-md mb-3"
        title="Click to change profile picture"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile Avatar"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-primary font-bold text-2xl transition-all duration-200 group-hover:opacity-60">
            {initials}
          </span>
        )}

        {/* Hover Camera Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-[10px] font-semibold">
          {uploading ? (
            <HiOutlineArrowPath className="size-5 animate-spin" />
          ) : (
            <>
              <HiOutlineCamera className="size-5 mb-0.5" />
              <span>Change</span>
            </>
          )}
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {error ? (
        <span className="text-[10px] text-destructive flex items-center gap-1 mt-1 max-w-[150px] text-center">
          <HiOutlineExclamationTriangle className="size-3 shrink-0" />
          {error}
        </span>
      ) : null}
    </div>
  );
}
