import { db } from "@repo/db";

export async function getJobPostings(companyId: string) {
  try {
    return await db.query.jobPosting.findMany({
      where: (job, { eq, and }) =>
        and(eq(job.companyId, companyId), eq(job.isArchived, false)),
      orderBy: (job, { desc }) => desc(job.createdAt),
    });
  } catch (error) {
    console.error("Failed to fetch job postings:", error);
    throw new Error("Failed to fetch job postings");
  }
}
