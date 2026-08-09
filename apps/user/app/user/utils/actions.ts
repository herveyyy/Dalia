"use server";

import { auth, getSafeSession } from "@repo/auth";
import { db, eq, and, or, ilike, desc, jobApplication, jobPosting, company, department, logActivity } from "@repo/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


async function getSessionUser() {
  const session = await getSafeSession(await headers());
  return session?.user ?? null;
}

export async function applyForJobAction(data: {
  jobPostingId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return { success: false, error: "Please log in to submit a job application." };
    }

    const [posting] = await db
      .select({ id: jobPosting.id, companyId: jobPosting.companyId, title: jobPosting.title })
      .from(jobPosting)
      .where(and(eq(jobPosting.id, data.jobPostingId), eq(jobPosting.isArchived, false)))
      .limit(1);

    if (!posting) {
      return { success: false, error: "Job posting not found or no longer active." };
    }

    const [existing] = await db
      .select({ id: jobApplication.id })
      .from(jobApplication)
      .where(and(eq(jobApplication.jobPostingId, data.jobPostingId), eq(jobApplication.userId, user.id)))
      .limit(1);

    if (existing) {
      return { success: false, error: "You have already applied for this job posting." };
    }

    const [newApp] = await db
      .insert(jobApplication)
      .values({
        jobPostingId: posting.id,
        userId: user.id,
        companyId: posting.companyId,
        coverLetter: data.coverLetter || null,
        resumeUrl: data.resumeUrl || null,
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    if (newApp) {
      await logActivity(db, {
        companyId: posting.companyId,
        actorId: user.id,
        actorName: user.name,
        actorEmail: user.email,
        entityType: "job_application",
        entityId: newApp.id,
        action: "CREATE",
        summary: `Submitted job application for "${posting.title}"`,
        newData: newApp,
      });
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

  if (!name || !email || !password) {
    redirect(`/user/register?jobId=${encodeURIComponent(jobId)}&error=${encodeURIComponent("All required fields must be filled.")}`);
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
      const [posting] = await db
        .select({ id: jobPosting.id, companyId: jobPosting.companyId, title: jobPosting.title })
        .from(jobPosting)
        .where(and(eq(jobPosting.id, jobId), eq(jobPosting.isArchived, false)))
        .limit(1);

      if (posting) {
        const [newApp] = await db
          .insert(jobApplication)
          .values({
            jobPostingId: posting.id,
            userId: registeredUser.id,
            companyId: posting.companyId,
            coverLetter: coverLetter || null,
            resumeUrl: resumeUrl || null,
            status: "Pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .returning();

        if (newApp) {
          await logActivity(db, {
            companyId: posting.companyId,
            actorId: registeredUser.id,
            actorName: registeredUser.name,
            actorEmail: registeredUser.email,
            entityType: "job_application",
            entityId: newApp.id,
            action: "CREATE",
            summary: `Submitted candidate application for "${posting.title}" upon registration`,
            newData: newApp,
          });
        }
      }
    }
  } catch (err: any) {
    const msg = err?.message || "Registration failed. Please check your credentials.";
    redirect(`/user/register?jobId=${encodeURIComponent(jobId)}&error=${encodeURIComponent(msg)}`);
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
    const limit = params.limit ?? 6;
    const page = params.page ?? 1;
    const offset = (page - 1) * limit;

    const conditions: any[] = [
      eq(jobPosting.isArchived, false),
      eq(jobPosting.status, "Published"),
    ];

    if (params.search?.trim()) {
      const q = `%${params.search.trim()}%`;
      conditions.push(
        or(
          ilike(jobPosting.title, q),
          ilike(jobPosting.description, q),
          ilike(jobPosting.location, q),
          ilike(company.name, q)
        )!
      );
    }

    if (params.employmentType && params.employmentType !== "ALL") {
      conditions.push(eq(jobPosting.employmentType, params.employmentType));
    }

    if (params.departmentId && params.departmentId !== "ALL") {
      conditions.push(eq(jobPosting.departmentId, params.departmentId));
    }

    const rows = await db
      .select({
        id: jobPosting.id,
        companyId: jobPosting.companyId,
        title: jobPosting.title,
        departmentId: jobPosting.departmentId,
        location: jobPosting.location,
        employmentType: jobPosting.employmentType,
        description: jobPosting.description,
        requirements: jobPosting.requirements,
        salaryRange: jobPosting.salaryRange,
        status: jobPosting.status,
        createdAt: jobPosting.createdAt,
        company: {
          id: company.id,
          name: company.name,
          logoUrl: company.logoUrl,
          headquarters: company.headquarters,
          description: company.description,
        },
        department: {
          id: department.id,
          name: department.name,
        },
      })
      .from(jobPosting)
      .innerJoin(company, eq(jobPosting.companyId, company.id))
      .leftJoin(department, eq(jobPosting.departmentId, department.id))
      .where(and(...conditions))
      .orderBy(desc(jobPosting.createdAt))
      .limit(limit)
      .offset(offset);

    const hasMore = rows.length === limit;

    return {
      success: true,
      jobs: rows,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to fetch paginated jobs:", error);
    return { success: false, jobs: [], hasMore: false };
  }
}

