import {
  db,
  company,
  eq,
  user,
  workspace,
  employee,
  employeeEmergencyContact,
  employeeDeduction,
  deductionType,
  employeeAllowance,
  allowanceType,
  taxType,
  inArray,
} from "@repo/db";

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
    const employees = await db
      .select()
      .from(employee)
      .where(eq(employee.companyId, companyId));

    if (employees.length === 0) {
      return [];
    }

    const employeeIds = employees.map((e) => e.id);

    const [contacts, deductions, allowances, taxTypes] = await Promise.all([
      db
        .select()
        .from(employeeEmergencyContact)
        .where(inArray(employeeEmergencyContact.employeeId, employeeIds)),
      db
        .select({
          deduction: employeeDeduction,
          type: deductionType,
        })
        .from(employeeDeduction)
        .leftJoin(deductionType, eq(employeeDeduction.deductionTypeId, deductionType.id))
        .where(inArray(employeeDeduction.employeeId, employeeIds)),
      db
        .select({
          allowance: employeeAllowance,
          type: allowanceType,
        })
        .from(employeeAllowance)
        .leftJoin(allowanceType, eq(employeeAllowance.allowanceTypeId, allowanceType.id))
        .where(inArray(employeeAllowance.employeeId, employeeIds)),
      db
        .select()
        .from(taxType)
        .where(eq(taxType.companyId, companyId)),
    ]);

    return employees.map((emp) => {
      const empContacts = contacts.filter((c) => c.employeeId === emp.id);
      const empDeductions = deductions
        .filter((d) => d.deduction.employeeId === emp.id)
        .map((d) => ({
          ...d.deduction,
          deductionType: d.type,
        }));
      const empAllowances = allowances
        .filter((a) => a.allowance.employeeId === emp.id)
        .map((a) => ({
          ...a.allowance,
          allowanceType: a.type,
        }));
      const empTaxType = taxTypes.find((t) => t.id === emp.taxTypeId) || null;

      return {
        ...emp,
        emergencyContacts: empContacts,
        deductions: empDeductions,
        allowances: empAllowances,
        taxType: empTaxType,
      };
    });
  } catch (error) {
    console.error("Failed to fetch employees list:", error);
    throw new Error("Failed to fetch employees list");
  }
}

export async function getAllowanceTypes(companyId: string) {
  try {
    return await db
      .select()
      .from(allowanceType)
      .where(eq(allowanceType.companyId, companyId));
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
