"use server";

import { auth, getSafeSession } from "@repo/auth";
import {
  createPresignedUploadUrl,
  PresignedUploadResult,
} from "@repo/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  UploadedFilePayload,
  createCandidateJobApplication,
  saveUserDefaultMaterialsDb,
  deleteUserFileDb,
  getPublishedJobsPaginated,
  getUserAppliedJobIds,
} from "./queries";

export type { UploadedFilePayload };

async function getSessionUser() {
  const session = await getSafeSession(await headers());
  return session?.user ?? null;
}

export type PresignedUploadResponse =
  | ({ success: true } & PresignedUploadResult)
  | { success: false; error: string };

export async function getPresignedUploadUrlAction(params: {
  parentType: string;
  fileCategory: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  userId?: string;
}): Promise<PresignedUploadResponse> {
  try {
    const sessionUser = await getSessionUser();
    const effectiveUserId = params.userId || sessionUser?.id || "candidates";
    const result = await createPresignedUploadUrl({
      ...params,
      userId: effectiveUserId,
    });
    return { success: true, ...result };
  } catch (error: any) {
    console.error("Failed to generate presigned upload URL:", error);
    return { success: false, error: error?.message || "Failed to generate presigned upload URL" };
  }
}

export async function applyForJobAction(data: {
  jobPostingId: string;
  coverLetter?: string;
  resumeUrl?: string;
  files?: UploadedFilePayload[];
}) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return { success: false, error: "Please log in to submit a job application." };
    }

    const res = await createCandidateJobApplication({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      jobPostingId: data.jobPostingId,
      coverLetter: data.coverLetter,
      resumeUrl: data.resumeUrl,
      files: data.files,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to submit application." };
    }

    revalidatePath("/user/applications");
    revalidatePath("/user/jobs");
    return { success: true };
  } catch (error) {
    console.error("Failed to apply for job:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}

export async function registerAndApplyAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const jobId = String(formData.get("jobId") ?? "").trim();
  const coverLetter = String(formData.get("coverLetter") ?? "").trim();
  const resumeUrl = String(formData.get("resumeUrl") ?? "").trim();
  const filesJson = String(formData.get("files") ?? "").trim();

  let uploadedFiles: UploadedFilePayload[] = [];
  if (filesJson) {
    try {
      uploadedFiles = JSON.parse(filesJson);
    } catch (e) {
      console.warn("Failed to parse files payload:", e);
    }
  }

  if (!name || !email || !password) {
    redirect(
      `/user/register?jobId=${encodeURIComponent(jobId)}&error=${encodeURIComponent(
        "All required fields must be filled."
      )}`
    );
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    const registeredUser = result?.user;

    if (registeredUser && jobId) {
      await createCandidateJobApplication({
        userId: registeredUser.id,
        userName: registeredUser.name,
        userEmail: registeredUser.email,
        jobPostingId: jobId,
        coverLetter: coverLetter || undefined,
        resumeUrl: resumeUrl || undefined,
        files: uploadedFiles,
      });
    }
  } catch (err: any) {
    const msg = err?.message || "Registration failed. Please check your credentials.";
    redirect(
      `/user/register?jobId=${encodeURIComponent(jobId)}&error=${encodeURIComponent(msg)}`
    );
  }

  redirect("/user/applications?applied=true");
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect(`/user/profile?error=${encodeURIComponent("Please fill in all password fields.")}`);
  }

  if (newPassword !== confirmPassword) {
    redirect(`/user/profile?error=${encodeURIComponent("New passwords do not match.")}`);
  }

  if (newPassword.length < 8) {
    redirect(`/user/profile?error=${encodeURIComponent("Password must be at least 8 characters long.")}`);
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch (err: any) {
    const msg = err?.message || "Failed to change password. Ensure current password is correct.";
    redirect(`/user/profile?error=${encodeURIComponent(msg)}`);
  }

  redirect(`/user/profile?success=${encodeURIComponent("Password updated successfully!")}`);
}

export async function userSignInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const redirectUrl = String(formData.get("redirect") ?? "/user").trim();

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (err: any) {
    const msg = err?.message || "Invalid credentials.";
    redirect(`/user/login?redirect=${encodeURIComponent(redirectUrl)}&error=${encodeURIComponent(msg)}`);
  }

  redirect(redirectUrl || "/user");
}

export async function fetchPublishedJobsPaginatedAction(params: {
  page: number;
  limit?: number;
  search?: string;
  employmentType?: string;
  departmentId?: string;
}) {
  try {
    const user = await getSessionUser();
    const appliedJobIds = user ? await getUserAppliedJobIds(user.id) : [];

    const result = await getPublishedJobsPaginated({
      ...params,
      excludeJobIds: appliedJobIds,
    });

    return {
      success: true,
      jobs: result.jobs,
      hasMore: result.hasMore,
    };
  } catch (error) {
    console.error("Failed to fetch paginated jobs:", error);
    return { success: false, jobs: [], hasMore: false };
  }
}

export async function saveUserDefaultMaterialsAction(data: {
  files?: UploadedFilePayload[];
  deletedFileIds?: string[];
}) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return { success: false, error: "Please log in to update default materials." };
    }

    const res = await saveUserDefaultMaterialsDb({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      files: data.files,
      deletedFileIds: data.deletedFileIds,
    });

    if (!res.success) {
      return { success: false, error: "Failed to update default materials." };
    }

    revalidatePath("/user/profile");
    revalidatePath("/user/jobs");
    revalidatePath("/user/register");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save default materials:", error);
    return { success: false, error: error?.message || "Failed to update default materials." };
  }
}

export async function deleteUserFileAction(fileId: string) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return { success: false, error: "Please log in to manage materials." };
    }

    const res = await deleteUserFileDb({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      fileId,
    });

    if (!res.success) {
      return { success: false, error: "Failed to delete file." };
    }

    revalidatePath("/user/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user file:", error);
    return { success: false, error: error?.message || "Failed to delete file." };
  }
}
