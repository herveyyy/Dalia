"use server";

import { db, eq, jobPosting } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function saveJobPosting(data: {
  id?: string | null;
  companyId: string;
  title: string;
  department?: string | null;
  location?: string | null;
  employmentType: string;
  description: string;
  requirements?: string | null;
  salaryRange?: string | null;
  status?: string;
}) {
  try {
    const isUpdate = !!data.id;
    const jobId = data.id || `job_${Math.random().toString(36).substring(2, 11)}`;

    const values = {
      id: jobId,
      companyId: data.companyId,
      title: data.title,
      department: data.department || null,
      location: data.location || null,
      employmentType: data.employmentType,
      description: data.description,
      requirements: data.requirements || null,
      salaryRange: data.salaryRange || null,
      status: data.status || "Published",
      isArchived: false,
      updatedAt: new Date().toISOString(),
    };

    if (isUpdate) {
      await db.update(jobPosting).set(values).where(eq(jobPosting.id, jobId));
    } else {
      await db.insert(jobPosting).values({
        ...values,
        createdAt: new Date().toISOString(),
      });
    }

    revalidatePath("/hris/jobs");
    return { success: true };
  } catch (error) {
    console.error("Failed to save job posting:", error);
    throw new Error("Failed to save job posting");
  }
}

export async function deleteJobPosting(id: string) {
  try {
    // Per requirements, DELETE is just archive = true
    await db
      .update(jobPosting)
      .set({ isArchived: true, updatedAt: new Date().toISOString() })
      .where(eq(jobPosting.id, id));

    revalidatePath("/hris/jobs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete job posting:", error);
    throw new Error("Failed to delete job posting");
  }
}
