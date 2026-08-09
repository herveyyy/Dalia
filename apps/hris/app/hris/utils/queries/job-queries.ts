import {
  db,
  jobPosting,
  jobApplication,
  eq,
  and,
  ilike,
  sql,
  department,
  branch,
  desc,
  asc,
} from "@repo/db";

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
      db
        .select({
          id: jobPosting.id,
          companyId: jobPosting.companyId,
          title: jobPosting.title,
          description: jobPosting.description,
          requirements: jobPosting.requirements,
          departmentId: jobPosting.departmentId,
          employmentType: jobPosting.employmentType,
          salaryRange: jobPosting.salaryRange,
          location: jobPosting.location,
          status: jobPosting.status,
          isArchived: jobPosting.isArchived,
          createdAt: jobPosting.createdAt,
          updatedAt: jobPosting.updatedAt,
          department: {
            name: department.name,
          },
          applicantCount: sql<number>`(
            SELECT count(*) FROM "job_application" ja WHERE ja."job_posting_id" = ${jobPosting.id}
          )::int`,
        })
        .from(jobPosting)
        .leftJoin(department, eq(jobPosting.departmentId, department.id))
        .where(whereClause)
        .orderBy(desc(jobPosting.createdAt))
        .limit(itemsPerPage)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)` })
        .from(jobPosting)
        .where(whereClause),
    ]);

    const formatted = list.map((job) => ({
      ...job,
      department: job.department?.name || null,
      applicantCount: Number(job.applicantCount ?? 0),
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
    return await db
      .select()
      .from(department)
      .where(and(eq(department.companyId, companyId), eq(department.isArchived, false)))
      .orderBy(asc(department.name));
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
}

export async function getCompanyBranches(companyId: string) {
  try {
    return await db
      .select()
      .from(branch)
      .where(and(eq(branch.companyId, companyId), eq(branch.isArchived, false)))
      .orderBy(asc(branch.name));
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return [];
  }
}
