import { cache } from "react";
import {
  db,
  eq,
  and,
  ilike,
  or,
  desc,
  user,
  employee,
  company,
  department,
  branch,
  jobPosting,
  jobApplication,
  sql,
  getFilesWithFreshUrlsByParent,
} from "@repo/db";

export const getUserProfileAndEmployment = cache(async (userId: string) => {
  const [userRecord] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userRecord) return null;

  const [employeeRecord] = await db
    .select({
      id: employee.id,
      employeeNo: employee.employeeNo,
      jobTitle: employee.jobTitle,
      employmentStatus: employee.employmentStatus,
      employmentSchedule: employee.employmentSchedule,
      dateOfHire: employee.dateOfHire,
      workEmail: employee.workEmail,
      personalEmail: employee.personalEmail,
      phoneNumber: employee.phoneNumber,
      residentialAddress: employee.residentialAddress,
      payType: employee.payType,
      payFrequency: employee.payFrequency,
      company: {
        id: company.id,
        name: company.name,
        businessType: company.businessType,
        websiteUrl: company.websiteUrl,
        headquarters: company.headquarters,
        description: company.description,
        logoUrl: company.logoUrl,
      },
      department: {
        id: department.id,
        name: department.name,
      },
      branch: {
        id: branch.id,
        name: branch.name,
      },
    })
    .from(employee)
    .innerJoin(company, eq(employee.companyId, company.id))
    .leftJoin(department, eq(employee.departmentId, department.id))
    .leftJoin(branch, eq(employee.branchId, branch.id))
    .where(eq(employee.userId, userId))
    .limit(1);

  return {
    user: userRecord,
    employee: employeeRecord ?? null,
  };
});

export const getUserApplications = cache(async (userId: string) => {
  const rows = await db
    .select({
      id: jobApplication.id,
      status: jobApplication.status,
      coverLetter: jobApplication.coverLetter,
      resumeUrl: jobApplication.resumeUrl,
      createdAt: jobApplication.createdAt,
      updatedAt: jobApplication.updatedAt,
      jobPosting: {
        id: jobPosting.id,
        title: jobPosting.title,
        location: jobPosting.location,
        employmentType: jobPosting.employmentType,
        salaryRange: jobPosting.salaryRange,
      },
      company: {
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
        headquarters: company.headquarters,
      },
      department: {
        id: department.id,
        name: department.name,
      },
    })
    .from(jobApplication)
    .innerJoin(jobPosting, eq(jobApplication.jobPostingId, jobPosting.id))
    .innerJoin(company, eq(jobApplication.companyId, company.id))
    .leftJoin(department, eq(jobPosting.departmentId, department.id))
    .where(eq(jobApplication.userId, userId))
    .orderBy(desc(jobApplication.createdAt));

  // Attach fresh files for each application
  const rowsWithFiles = await Promise.all(
    rows.map(async (row) => {
      const files = await getFilesWithFreshUrlsByParent(db, row.id, "job_application");
      return {
        ...row,
        files,
        videoFile: files.find((f) => f.fileCategory === "video") || null,
        resumeFile: files.find((f) => f.fileCategory === "resume") || null,
        coverLetterFile: files.find((f) => f.fileCategory === "cover_letter") || null,
      };
    })
  );

  return rowsWithFiles;
});

export const getPublishedJobs = cache(
  async (filters?: {
    search?: string;
    employmentType?: string;
    departmentId?: string;
  }) => {
    const conditions = [
      eq(jobPosting.isArchived, false),
      eq(jobPosting.status, "Published"),
    ];

    if (filters?.search?.trim()) {
      const q = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(jobPosting.title, q),
          ilike(jobPosting.description, q),
          ilike(jobPosting.location, q),
          ilike(company.name, q)
        )!
      );
    }

    if (filters?.employmentType && filters.employmentType !== "ALL") {
      conditions.push(eq(jobPosting.employmentType, filters.employmentType));
    }

    if (filters?.departmentId && filters.departmentId !== "ALL") {
      conditions.push(eq(jobPosting.departmentId, filters.departmentId));
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
      .orderBy(desc(jobPosting.createdAt));

    return rows;
  }
);

export const getJobPostingById = cache(async (id: string) => {
  const [row] = await db
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
    .where(and(eq(jobPosting.id, id), eq(jobPosting.isArchived, false)))
    .limit(1);

  return row ?? null;
});

export const getDepartmentsList = cache(async () => {
  const rows = await db
    .select({
      id: department.id,
      name: department.name,
    })
    .from(department)
    .where(eq(department.isArchived, false));

  return rows;
});
