import { db } from "@repo/db";

export async function getJobPostings(companyId: string) {
  try {
    const list = await db.query.jobPosting.findMany({
      where: (job, { eq, and }) =>
        and(eq(job.companyId, companyId), eq(job.isArchived, false)),
      with: {
        department: { columns: { name: true } },
      },
      orderBy: (job, { desc }) => desc(job.createdAt),
    });

    return list.map((job) => ({
      ...job,
      department: job.department?.name || null,
    }));
  } catch (error) {
    console.error("Failed to fetch job postings:", error);
    throw new Error("Failed to fetch job postings");
  }
}
