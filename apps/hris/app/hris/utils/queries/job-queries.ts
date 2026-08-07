import { db, jobPosting, eq, and, ilike, sql } from "@repo/db";

export interface GetJobPostingsParams {
  companyId: string;
  page?: number;
  itemsPerPage?: number;
  search?: string;
}

export async function getJobPostings(params: GetJobPostingsParams | string) {
  try {
    const companyId = typeof params === "string" ? params : params.companyId;
    const page = typeof params === "string" ? 1 : params.page || 1;
    const itemsPerPage = typeof params === "string" ? 100 : params.itemsPerPage || 10;
    const search = typeof params === "string" ? undefined : params.search;

    const offset = (page - 1) * itemsPerPage;

    const conditions: any[] = [
      eq(jobPosting.companyId, companyId),
      eq(jobPosting.isArchived, false),
    ];

    if (search && search.trim()) {
      conditions.push(ilike(jobPosting.title, `%${search.trim()}%`));
    }

    const whereClause = and(...conditions);

    const [list, [totalResult]] = await Promise.all([
      db.query.jobPosting.findMany({
        where: (job, { eq, and }) => whereClause,
        with: {
          department: { columns: { name: true } },
        },
        orderBy: (job, { desc }) => desc(job.createdAt),
        limit: itemsPerPage,
        offset: offset,
      }),
      db
        .select({ total: sql<number>`count(*)` })
        .from(jobPosting)
        .where(whereClause),
    ]);

    const formatted = list.map((job) => ({
      ...job,
      department: job.department?.name || null,
    }));

    return {
      jobPostings: formatted,
      totalCount: Number(totalResult?.total ?? 0),
    };
  } catch (error) {
    console.error("Failed to fetch job postings:", error);
    return { jobPostings: [], totalCount: 0 };
  }
}

export async function getCompanyDepartments(companyId: string) {
  try {
    return await db.query.department.findMany({
      where: (dept, { eq, and }) =>
        and(eq(dept.companyId, companyId), eq(dept.isArchived, false)),
      orderBy: (dept, { asc }) => asc(dept.name),
    });
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
}

export async function getCompanyBranches(companyId: string) {
  try {
    return await db.query.branch.findMany({
      where: (br, { eq, and }) =>
        and(eq(br.companyId, companyId), eq(br.isArchived, false)),
      orderBy: (br, { asc }) => asc(br.name),
    });
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return [];
  }
}
