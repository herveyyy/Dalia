"use server";

import { db, eq, jobPosting, logActivity, jobApplication, user, employee, getFilesWithFreshUrlsByParent, desc } from "@repo/db";
import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
  const session = await getSafeSession(await headers());
  return session?.user ?? null;
}

export async function saveJobPosting(data: {
  id?: string | null;
  companyId: string;
  title: string;
  departmentId?: string | null;
  location?: string | null;
  employmentType: string;
  description: string;
  requirements?: string | null;
  salaryRange?: string | null;
  status?: string;
}) {
  try {
    const user = await getSessionUser();
    const isUpdate = !!data.id;

    const values = {
      companyId: data.companyId,
      title: data.title,
      departmentId: data.departmentId || null,
      location: data.location || null,
      employmentType: data.employmentType,
      description: data.description,
      requirements: data.requirements || null,
      salaryRange: data.salaryRange || null,
      status: data.status || "Published",
      isArchived: false,
      updatedAt: new Date().toISOString(),
    };

    let oldRecord: any = null;
    let newRecord: any = null;
    let jobId = data.id ?? null;

    if (isUpdate && data.id) {
      [oldRecord] = await db.select().from(jobPosting).where(eq(jobPosting.id, data.id));
      [newRecord] = await db
        .update(jobPosting)
        .set(values)
        .where(eq(jobPosting.id, data.id))
        .returning();
    } else {
      [newRecord] = await db
        .insert(jobPosting)
        .values({
          ...values,
          createdAt: new Date().toISOString(),
        })
        .returning();
      jobId = newRecord?.id ?? null;
    }

    if (jobId && newRecord) {
      await logActivity(db, {
        companyId: data.companyId,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        entityType: "job_posting",
        entityId: jobId,
        action: isUpdate ? "UPDATE" : "CREATE",
        summary: isUpdate ? `Updated job posting "${data.title}"` : `Created job posting "${data.title}"`,
        oldData: oldRecord || null,
        newData: newRecord || null,
      });
    }

    revalidatePath("/hris/jobs");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to save job posting:", error);
    throw new Error("Failed to save job posting");
  }
}

export async function deleteJobPosting(id: string) {
  try {
    const user = await getSessionUser();

    const [oldRecord] = await db.select().from(jobPosting).where(eq(jobPosting.id, id));
    const [newRecord] = await db
      .update(jobPosting)
      .set({ isArchived: true, updatedAt: new Date().toISOString() })
      .where(eq(jobPosting.id, id))
      .returning();

    if (oldRecord && newRecord) {
      await logActivity(db, {
        companyId: oldRecord.companyId,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        entityType: "job_posting",
        entityId: id,
        action: "ARCHIVE",
        summary: `Archived job posting "${oldRecord.title}"`,
        oldData: oldRecord,
        newData: newRecord,
      });
    }

    revalidatePath("/hris/jobs");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete job posting:", error);
    throw new Error("Failed to delete job posting");
  }
}

export async function getJobApplicationsAction(jobPostingId: string) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized access. Please log in." };
    }

    const list = await db
      .select({
        id: jobApplication.id,
        jobPostingId: jobApplication.jobPostingId,
        status: jobApplication.status,
        coverLetter: jobApplication.coverLetter,
        resumeUrl: jobApplication.resumeUrl,
        createdAt: jobApplication.createdAt,
        updatedAt: jobApplication.updatedAt,
        candidate: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      })
      .from(jobApplication)
      .innerJoin(user, eq(jobApplication.userId, user.id))
      .where(eq(jobApplication.jobPostingId, jobPostingId))
      .orderBy(desc(jobApplication.createdAt));

    // Resolve S3 files for each application
    const applications = await Promise.all(
      list.map(async (app) => {
        const files = await getFilesWithFreshUrlsByParent(db, app.id, "job_application");
        return {
          ...app,
          files,
          videoFile: files.find((f) => f.fileCategory === "video") || null,
          resumeFile: files.find((f) => f.fileCategory === "resume") || null,
          coverLetterFile: files.find((f) => f.fileCategory === "cover_letter") || null,
        };
      })
    );

    return { success: true, applications };
  } catch (error: any) {
    console.error("Failed to fetch applications:", error);
    return { success: false, error: error?.message || "Failed to load applications." };
  }
}

function parseSalaryNumber(salaryRange: string | null | undefined): string {
  if (!salaryRange) return "0.00";

  // Lowercase and trim
  const clean = salaryRange.toLowerCase().trim();

  // If there's a range, let's take the first part
  // e.g. "60k - 80k" -> "60k"
  // e.g. "₱50,000 to ₱70,000" -> "₱50,000"
  const firstPart = (clean.split(/[-–—]|to/)[0] || "").trim();

  // Extract all digits, commas, dots, and 'k'
  // e.g. "₱60k" -> "60k"
  // e.g. "₱50,000" -> "50,000"
  const numberPart = firstPart.replace(/[^0-9.k]/g, "");

  if (numberPart.includes("k")) {
    const numericStr = numberPart.replace("k", "");
    const value = parseFloat(numericStr);
    if (!isNaN(value)) {
      return (value * 1000).toFixed(2);
    }
  } else {
    // Strip commas if any and parse float
    const numericStr = numberPart.replace(/,/g, "");
    const value = parseFloat(numericStr);
    if (!isNaN(value)) {
      return value.toFixed(2);
    }
  }

  return "0.00";
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: "Pending" | "Viewed" | "Interviewing" | "Accepted" | "Rejected",
  agreedSalary?: string
) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized access. Please log in." };
    }

    // 1. Get old record and details for audit logs
    const [oldApp] = await db
      .select()
      .from(jobApplication)
      .where(eq(jobApplication.id, applicationId))
      .limit(1);

    if (!oldApp) {
      return { success: false, error: "Application not found." };
    }

    // 2. Update status
    const [newApp] = await db
      .update(jobApplication)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(jobApplication.id, applicationId))
      .returning();

    if (!newApp) {
      return { success: false, error: "Failed to update application status." };
    }

    // 3. Fetch candidate user name
    const [candidate] = await db
      .select({ name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, oldApp.userId))
      .limit(1);

    const [job] = await db
      .select({
        title: jobPosting.title,
        departmentId: jobPosting.departmentId,
        salaryRange: jobPosting.salaryRange,
      })
      .from(jobPosting)
      .where(eq(jobPosting.id, oldApp.jobPostingId))
      .limit(1);

    // If accepted, check and auto-create an employee record
    if (status === "Accepted") {
      const [existingEmployee] = await db
        .select()
        .from(employee)
        .where(eq(employee.userId, oldApp.userId))
        .limit(1);

      if (!existingEmployee && candidate) {
        const nameParts = (candidate.name || "First Last").split(" ");
        const firstName = nameParts[0] || "First";
        const lastName = nameParts.slice(1).join(" ") || "Last";

        await db.insert(employee).values({
          userId: oldApp.userId,
          companyId: oldApp.companyId,
          firstName,
          lastName,
          workEmail: candidate.email,
          personalEmail: candidate.email,
          jobTitle: job?.title || "New Hire",
          departmentId: job?.departmentId || null,
          employmentStatus: "Active",
          payFrequency: "Semi-monthly",
          basePayRate: agreedSalary || parseSalaryNumber(job?.salaryRange),
          totalRegularHours: "0.00",
          overtimeHours: "0.00",
          leaveBalanceDays: "0.00",
          dateOfHire: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Close the job posting since it has been filled/accepted
      await db
        .update(jobPosting)
        .set({
          status: "Closed",
          updatedAt: new Date().toISOString(),
        })
        .where(eq(jobPosting.id, oldApp.jobPostingId));
    }

    // 4. Log activity
    await logActivity(db, {
      companyId: oldApp.companyId,
      actorId: sessionUser.id,
      actorName: sessionUser.name,
      actorEmail: sessionUser.email,
      entityType: "job_application",
      entityId: applicationId,
      action: "UPDATE",
      summary: `${status === "Accepted" ? "Accepted" : "Rejected"} job application of candidate "${
        candidate?.name || "Anonymous"
      }" for job posting "${job?.title || "Unknown"}"`,
      oldData: oldApp,
      newData: newApp,
    });

    revalidatePath("/hris/jobs");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update application status:", error);
    return { success: false, error: error?.message || "Failed to update status." };
  }
}
