import { cache } from "react";
import { db, jobPosting, company, department, eq, and, ilike, desc } from "@repo/db";

export const getPublishedJobs = cache(async (companyName?: string) => {
  const conditions = [
    eq(jobPosting.isArchived, false),
    eq(jobPosting.status, "Published"),
  ];

  if (companyName?.trim()) {
    conditions.push(ilike(company.name, `%${companyName.trim()}%`));
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
      isArchived: jobPosting.isArchived,
      createdAt: jobPosting.createdAt,
      updatedAt: jobPosting.updatedAt,
      company: {
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
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
    .orderBy(desc(jobPosting.createdAt));

  return rows;
});

export const getCompanyByName = cache(async (companyName: string) => {
  if (!companyName?.trim()) return null;

  const [record] = await db
    .select()
    .from(company)
    .where(ilike(company.name, `%${companyName.trim()}%`))
    .limit(1);

  return record ?? null;
});
