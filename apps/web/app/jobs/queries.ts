import { db, jobPosting, company, eq, and, ilike } from "@repo/db";
import { unstable_cache } from "next/cache";

export async function getPublishedJobs(companyName?: string) {
  return unstable_cache(
    async () => {
      const results = await db.query.jobPosting.findMany({
        where: and(
          eq(jobPosting.isArchived, false),
          eq(jobPosting.status, "Published")
        ),
        with: {
          company: { columns: { id: true, name: true, logoUrl: true } },
          department: { columns: { id: true, name: true } },
        },
        orderBy: (jp, { desc }) => [desc(jp.createdAt)],
      });

      // If filtering by company name via relational query, we do a post-filter
      // since drizzle relational queries don't support cross-table where on `with`
      if (companyName) {
        return results.filter((r) =>
          r.company?.name?.toLowerCase().includes(companyName.toLowerCase())
        );
      }

      return results;
    },
    [`public-jobs-${companyName || "all"}`],
    { tags: ["public-jobs"], revalidate: 60 }
  )();
}

export async function getCompanyByName(companyName: string) {
  const [record] = await db
    .select()
    .from(company)
    .where(ilike(company.name, `%${companyName}%`))
    .limit(1);

  return record ?? null;
}
