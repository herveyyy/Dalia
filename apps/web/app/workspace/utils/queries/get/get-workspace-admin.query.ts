import { and, db, employee, eq, sql } from "@repo/db";

export interface WorkspaceAdminInfo {
  resolvedAdmin: string;
  adminHasLogin: boolean;
}

export async function getWorkspaceAdminInfo(
  companyId: string,
  adminEmail?: string,
  fallbackUserEmail?: string
): Promise<WorkspaceAdminInfo> {
  const trimmedEmail = adminEmail?.trim() || "";

  if (trimmedEmail) {
    const [adminEmployee] = await db
      .select({
        workEmail: employee.workEmail,
        userId: employee.userId,
      })
      .from(employee)
      .where(
        and(
          eq(employee.companyId, companyId),
          sql`lower(${employee.workEmail}) = ${trimmedEmail.toLowerCase()}`
        )
      )
      .limit(1);

    if (adminEmployee) {
      return {
        resolvedAdmin: adminEmployee.workEmail || trimmedEmail,
        adminHasLogin: Boolean(adminEmployee.userId),
      };
    }
    return {
      resolvedAdmin: trimmedEmail,
      adminHasLogin: false,
    };
  }

  const [firstEmployee] = await db
    .select({
      workEmail: employee.workEmail,
      userId: employee.userId,
    })
    .from(employee)
    .where(eq(employee.companyId, companyId))
    .limit(1);

  return {
    resolvedAdmin: firstEmployee?.workEmail || fallbackUserEmail || "",
    adminHasLogin: Boolean(firstEmployee?.userId),
  };
}
