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
  fileRecord,
  inArray,
  notInArray,
  sql,
  getFilesWithFreshUrlsByParent,
  saveFileRecord,
  logActivity,
  FileRecord,
} from "@repo/db";

export interface UploadedFilePayload {
  fileCategory: "video" | "resume" | "cover_letter" | string;
  fileName: string;
  fileKey: string;
  mimeType?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
}

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
        description: company.description,
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

  // Attach fresh presigned URLs for each application file
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

export const getUserAppliedJobIds = cache(async (userId: string): Promise<string[]> => {
  const apps = await db
    .select({ jobPostingId: jobApplication.jobPostingId })
    .from(jobApplication)
    .where(eq(jobApplication.userId, userId));

  return apps.map((a) => a.jobPostingId);
});

export const getPublishedJobs = cache(
  async (filters?: {
    search?: string;
    employmentType?: string;
    departmentId?: string;
    excludeJobIds?: string[];
  }) => {
    const conditions = [
      eq(jobPosting.isArchived, false),
      eq(jobPosting.status, "Published"),
    ];

    if (filters?.excludeJobIds && filters.excludeJobIds.length > 0) {
      conditions.push(notInArray(jobPosting.id, filters.excludeJobIds));
    }

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

export async function getPublishedJobsPaginated(params: {
  page: number;
  limit?: number;
  search?: string;
  employmentType?: string;
  departmentId?: string;
  excludeJobIds?: string[];
}) {
  const limit = params.limit ?? 6;
  const page = params.page ?? 1;
  const offset = (page - 1) * limit;

  const conditions: any[] = [
    eq(jobPosting.isArchived, false),
    eq(jobPosting.status, "Published"),
  ];

  if (params.excludeJobIds && params.excludeJobIds.length > 0) {
    conditions.push(notInArray(jobPosting.id, params.excludeJobIds));
  }

  if (params.search?.trim()) {
    const q = `%${params.search.trim()}%`;
    conditions.push(
      or(
        ilike(jobPosting.title, q),
        ilike(jobPosting.description, q),
        ilike(jobPosting.location, q),
        ilike(company.name, q)
      )!
    );
  }

  if (params.employmentType && params.employmentType !== "ALL") {
    conditions.push(eq(jobPosting.employmentType, params.employmentType));
  }

  if (params.departmentId && params.departmentId !== "ALL") {
    conditions.push(eq(jobPosting.departmentId, params.departmentId));
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
    .orderBy(desc(jobPosting.createdAt))
    .limit(limit)
    .offset(offset);

  const hasMore = rows.length === limit;

  return {
    jobs: rows,
    hasMore,
  };
}

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

export const getUserDefaultMaterials = cache(async (userId: string) => {
  const files = await getFilesWithFreshUrlsByParent(db, userId, "user");
  const videoFile = files.find((f) => f.fileCategory === "video") || null;
  const resumeFile = files.find((f) => f.fileCategory === "resume") || null;
  const coverLetterFile = files.find((f) => f.fileCategory === "cover_letter") || null;

  return {
    files,
    videoFile,
    resumeFile,
    coverLetterFile,
  };
});

/**
 * DB helper to create a job application, attach files, and write activity logs
 */
export async function createCandidateJobApplication(data: {
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  jobPostingId: string;
  coverLetter?: string;
  resumeUrl?: string;
  files?: UploadedFilePayload[];
}) {
  const [posting] = await db
    .select({ id: jobPosting.id, companyId: jobPosting.companyId, title: jobPosting.title })
    .from(jobPosting)
    .where(and(eq(jobPosting.id, data.jobPostingId), eq(jobPosting.isArchived, false)))
    .limit(1);

  if (!posting) {
    return { success: false, error: "Job posting not found or no longer active." };
  }

  const [existing] = await db
    .select({ id: jobApplication.id })
    .from(jobApplication)
    .where(and(eq(jobApplication.jobPostingId, data.jobPostingId), eq(jobApplication.userId, data.userId)))
    .limit(1);

  if (existing) {
    return { success: false, error: "You have already applied for this job posting." };
  }

  const [newApp] = await db
    .insert(jobApplication)
    .values({
      jobPostingId: posting.id,
      userId: data.userId,
      companyId: posting.companyId,
      coverLetter: data.coverLetter || null,
      resumeUrl: data.resumeUrl || null,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  if (!newApp) {
    return { success: false, error: "Failed to create application record." };
  }

  // Attach and save uploaded files to `files` table
  const savedFiles = [];
  if (data.files && data.files.length > 0) {
    for (const file of data.files) {
      if (file.fileKey && file.fileName) {
        const saved = await saveFileRecord(db, {
          parentId: newApp.id,
          parentType: "job_application",
          fileCategory: file.fileCategory,
          fileName: file.fileName,
          fileKey: file.fileKey,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
          metadata: file.metadata || {},
          companyId: posting.companyId,
          actorId: data.userId,
          actorName: data.userName,
          actorEmail: data.userEmail,
        });
        savedFiles.push(saved);
      }
    }
  }

  const fileTypesSummary = data.files?.map((f) => f.fileCategory).join(", ");
  await logActivity(db, {
    companyId: posting.companyId,
    actorId: data.userId,
    actorName: data.userName,
    actorEmail: data.userEmail,
    entityType: "job_application",
    entityId: newApp.id,
    action: "CREATE",
    summary: `Submitted job application for "${posting.title}"${
      fileTypesSummary ? ` with attached files (${fileTypesSummary})` : ""
    }`,
    newData: newApp,
    metadata: {
      jobPostingId: posting.id,
      jobTitle: posting.title,
      filesCount: savedFiles.length,
      files: savedFiles.map((f) => ({
        id: f.id,
        category: f.fileCategory,
        fileName: f.fileName,
      })),
    },
  });

  return { success: true, application: newApp, savedFiles };
}

/**
 * DB helper to save or delete user's default materials
 */
export async function saveUserDefaultMaterialsDb(data: {
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  files?: UploadedFilePayload[];
  deletedFileIds?: string[];
}) {
  // 1. Delete removed files if any
  if (data.deletedFileIds && data.deletedFileIds.length > 0) {
    await db
      .delete(fileRecord)
      .where(
        and(
          eq(fileRecord.parentId, data.userId),
          eq(fileRecord.parentType, "user"),
          inArray(fileRecord.id, data.deletedFileIds)
        )
      );
  }

  // 2. Save/Update new default files
  if (data.files && data.files.length > 0) {
    for (const filePayload of data.files) {
      await db
        .delete(fileRecord)
        .where(
          and(
            eq(fileRecord.parentId, data.userId),
            eq(fileRecord.parentType, "user"),
            eq(fileRecord.fileCategory, filePayload.fileCategory)
          )
        );

      await saveFileRecord(db, {
        parentId: data.userId,
        parentType: "user",
        fileCategory: filePayload.fileCategory,
        fileName: filePayload.fileName,
        fileKey: filePayload.fileKey,
        mimeType: filePayload.mimeType,
        fileSize: filePayload.fileSize,
        metadata: {
          ...filePayload.metadata,
          defaultMaterial: true,
        },
        actorId: data.userId,
        actorName: data.userName,
        actorEmail: data.userEmail,
      });
    }
  }

  await logActivity(db, {
    actorId: data.userId,
    actorName: data.userName,
    actorEmail: data.userEmail,
    entityType: "user_default_materials",
    entityId: data.userId,
    action: "UPDATE",
    summary: `${data.userName || data.userEmail} updated default application materials (resume, video, cover letter)`,
  });

  return { success: true };
}

/**
 * DB helper to delete a specific user file
 */
export async function deleteUserFileDb(data: {
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  fileId: string;
}) {
  await db
    .delete(fileRecord)
    .where(
      and(
        eq(fileRecord.id, data.fileId),
        eq(fileRecord.parentId, data.userId),
        eq(fileRecord.parentType, "user")
      )
    );

  await logActivity(db, {
    actorId: data.userId,
    actorName: data.userName,
    actorEmail: data.userEmail,
    entityType: "file",
    entityId: data.fileId,
    action: "DELETE",
    summary: `${data.userName || data.userEmail} deleted default material file (${data.fileId})`,
  });

  return { success: true };
}
