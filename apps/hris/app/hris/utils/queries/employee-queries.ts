import { db, company, eq, user, workspace } from "@repo/db";

export async function getCompanyRecord(companyId: string) {
  try {
    const [companyRecord] = await db
      .select()
      .from(company)
      .where(eq(company.id, companyId))
      .limit(1);

    return companyRecord ?? null;
  } catch (error) {
    console.error("Failed to fetch company record:", error);
    throw new Error("Failed to fetch company record");
  }
}

export async function getEmployees(companyId: string) {
  try {
    const employeesList = await db.query.employee.findMany({
      where: (emp, { eq }) => eq(emp.companyId, companyId),
      with: {
        emergencyContacts: true,
        deductions: {
          with: {
            deductionType: true,
          },
        },
        allowances: {
          with: {
            allowanceType: true,
          },
        },
        taxType: true,
      },
    });

    return employeesList;
  } catch (error) {
    console.error("Failed to fetch employees list:", error);
    throw new Error("Failed to fetch employees list");
  }
}

export async function getAllowanceTypes(companyId: string) {
  try {
    return await db.query.allowanceType.findMany({
      where: (alw, { eq }) => eq(alw.companyId, companyId),
    });
  } catch (error) {
    console.error("Failed to fetch allowance types:", error);
    throw new Error("Failed to fetch allowance types");
  }
}

export async function getUserRecord(userId: string) {
  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return userRecord ?? null;
  } catch (error) {
    console.error("Failed to fetch user record:", error);
    throw new Error("Failed to fetch user record");
  }
}

export async function getCompanyWorkspaces(companyId: string) {
  try {
    return await db
      .select()
      .from(workspace)
      .where(eq(workspace.companyId, companyId));
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    throw new Error("Failed to fetch workspaces");
  }
}
