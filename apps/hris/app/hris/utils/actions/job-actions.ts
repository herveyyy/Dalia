"use server";

import { db, eq, jobPosting, logActivity } from "@repo/db";
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
