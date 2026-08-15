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
  department,
  branch,
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
      .select({
        id: employee.id,
        employeeNo: employee.employeeNo,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        suffix: employee.suffix,
        dateOfBirth: employee.dateOfBirth,
        gender: employee.gender,
        personalEmail: employee.personalEmail,
        workEmail: employee.workEmail,
        phoneNumber: employee.phoneNumber,
        residentialAddress: employee.residentialAddress,
        tin: employee.tin,
        philhealth: employee.philhealth,
        pagIbig: employee.pagIbig,
        sssNo: employee.sssNo,
        philIdNo: employee.philIdNo,
        companyId: employee.companyId,
        userId: employee.userId,
        departmentId: employee.departmentId,
        branchId: employee.branchId,
        roleId: employee.roleId,
        jobTitle: employee.jobTitle,
        responsibilityCenter: employee.responsibilityCenter,
        employmentStatus: employee.employmentStatus,
        employmentSchedule: employee.employmentSchedule,
        supervisorId: employee.supervisorId,
        dateOfHire: employee.dateOfHire,
        payType: employee.payType,
        basePayRate: employee.basePayRate,
        payFrequency: employee.payFrequency,
        bankName: employee.bankName,
        bankAccountNumber: employee.bankAccountNumber,
        brstnBankCode: employee.brstnBankCode,
        totalRegularHours: employee.totalRegularHours,
        overtimeHours: employee.overtimeHours,
        leaveBalanceDays: employee.leaveBalanceDays,
        taxBracketCode: employee.taxBracketCode,
        taxTypeId: employee.taxTypeId,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
        department: department.name,
      })
      .from(employee)
      .leftJoin(department, eq(employee.departmentId, department.id))
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

export async function getEmployeeById(employeeId: string) {
  try {
    const [emp] = await db
      .select({
        id: employee.id,
        employeeNo: employee.employeeNo,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        suffix: employee.suffix,
        dateOfBirth: employee.dateOfBirth,
        gender: employee.gender,
        personalEmail: employee.personalEmail,
        workEmail: employee.workEmail,
        phoneNumber: employee.phoneNumber,
        residentialAddress: employee.residentialAddress,
        tin: employee.tin,
        philhealth: employee.philhealth,
        pagIbig: employee.pagIbig,
        sssNo: employee.sssNo,
        philIdNo: employee.philIdNo,
        companyId: employee.companyId,
        userId: employee.userId,
        departmentId: employee.departmentId,
        branchId: employee.branchId,
        roleId: employee.roleId,
        jobTitle: employee.jobTitle,
        responsibilityCenter: employee.responsibilityCenter,
        employmentStatus: employee.employmentStatus,
        employmentSchedule: employee.employmentSchedule,
        supervisorId: employee.supervisorId,
        dateOfHire: employee.dateOfHire,
        payType: employee.payType,
        basePayRate: employee.basePayRate,
        payFrequency: employee.payFrequency,
        bankName: employee.bankName,
        bankAccountNumber: employee.bankAccountNumber,
        brstnBankCode: employee.brstnBankCode,
        totalRegularHours: employee.totalRegularHours,
        overtimeHours: employee.overtimeHours,
        leaveBalanceDays: employee.leaveBalanceDays,
        taxBracketCode: employee.taxBracketCode,
        taxTypeId: employee.taxTypeId,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
        department: department.name,
      })
      .from(employee)
      .leftJoin(department, eq(employee.departmentId, department.id))
      .where(eq(employee.id, employeeId))
      .limit(1);

    if (!emp) return null;

    const [contacts, deductions, allowances, taxTypes] = await Promise.all([
      db
        .select()
        .from(employeeEmergencyContact)
        .where(eq(employeeEmergencyContact.employeeId, employeeId)),
      db
        .select({
          deduction: employeeDeduction,
          type: deductionType,
        })
        .from(employeeDeduction)
        .leftJoin(deductionType, eq(employeeDeduction.deductionTypeId, deductionType.id))
        .where(eq(employeeDeduction.employeeId, employeeId)),
      db
        .select({
          allowance: employeeAllowance,
          type: allowanceType,
        })
        .from(employeeAllowance)
        .leftJoin(allowanceType, eq(employeeAllowance.allowanceTypeId, allowanceType.id))
        .where(eq(employeeAllowance.employeeId, employeeId)),
      db
        .select()
        .from(taxType)
        .where(eq(taxType.companyId, emp.companyId)),
    ]);

    const empContacts = contacts;
    const empDeductions = deductions.map((d) => ({
      ...d.deduction,
      deductionType: d.type,
    }));
    const empAllowances = allowances.map((a) => ({
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
  } catch (error) {
    console.error("Failed to fetch employee details by id:", error);
    return null;
  }
}

export async function getDepartmentDetailsById(departmentId: string) {
  try {
    const [dept] = await db
      .select()
      .from(department)
      .where(eq(department.id, departmentId));

    if (!dept) return null;

    const employees = await db
      .select()
      .from(employee)
      .where(eq(employee.departmentId, departmentId));

    return {
      ...dept,
      employees,
    };
  } catch (error) {
    console.error("Failed to fetch department details:", error);
    return null;
  }
}

export async function getBranchDetailsById(branchId: string) {
  try {
    const [br] = await db
      .select()
      .from(branch)
      .where(eq(branch.id, branchId));

    if (!br) return null;

    const employees = await db
      .select()
      .from(employee)
      .where(eq(employee.branchId, branchId));

    return {
      ...br,
      employees,
    };
  } catch (error) {
    console.error("Failed to fetch branch details:", error);
    return null;
  }
}
