"use server";

import {
  db,
  eq,
  employee,
  employeeEmergencyContact,
  employeeDeduction,
  employeeAllowance,
  deductionType,
  allowanceType,
} from "@repo/db";
import { revalidatePath } from "next/cache";

export async function saveEmployee(data: any) {
  const isUpdate = !!data.id;
  const employeeId = data.id || `emp_${Math.random().toString(36).substring(2, 11)}`;

  await db.transaction(async (tx) => {
    // 1. Prepare employee record
    const employeeValues = {
      id: employeeId,
      employeeNo: data.employeeNo || null,
      firstName: data.firstName,
      middleName: data.middleName || null,
      lastName: data.lastName,
      suffix: data.suffix || null,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || null,
      personalEmail: data.personalEmail || null,
      workEmail: data.workEmail || null,
      phoneNumber: data.phoneNumber || null,
      residentialAddress: data.residentialAddress || null,
      tin: data.tin || null,
      philhealth: data.philhealth || null,
      pagIbig: data.pagIbig || null,
      sssNo: data.sssNo || null,
      philIdNo: data.philIdNo || null,
      companyId: data.companyId,
      department: data.department || null,
      jobTitle: data.jobTitle || null,
      responsibilityCenter: data.responsibilityCenter || null,
      employmentStatus: data.employmentStatus || "Active",
      employmentSchedule: data.employmentSchedule || null,
      supervisorId: data.supervisorId || null,
      dateOfHire: data.dateOfHire || null,
      payType: data.payType || null,
      basePayRate: data.basePayRate || "0.00",
      payFrequency: data.payFrequency || "Semi-monthly",
      bankName: data.bankName || null,
      bankAccountNumber: data.bankAccountNumber || null,
      brstnBankCode: data.brstnBankCode || null,
      totalRegularHours: data.totalRegularHours || "0.00",
      overtimeHours: data.overtimeHours || "0.00",
      leaveBalanceDays: data.leaveBalanceDays || "0.00",
      taxBracketCode: data.taxBracketCode || null,
    };

    if (isUpdate) {
      await tx.update(employee).set(employeeValues).where(eq(employee.id, employeeId));
    } else {
      await tx.insert(employee).values(employeeValues);
    }

    // 2. Save emergency contact
    await tx.delete(employeeEmergencyContact).where(eq(employeeEmergencyContact.employeeId, employeeId));
    if (data.emergencyContact && data.emergencyContact.contactPerson && data.emergencyContact.contactNo) {
      const contactId = `ec_${Math.random().toString(36).substring(2, 11)}`;
      await tx.insert(employeeEmergencyContact).values({
        id: contactId,
        employeeId,
        contactPerson: data.emergencyContact.contactPerson,
        contactNo: data.emergencyContact.contactNo,
        contactAddress: data.emergencyContact.contactAddress || null,
        relationship: data.emergencyContact.relationship,
      });
    }

    // 3. Save deductions
    await tx.delete(employeeDeduction).where(eq(employeeDeduction.employeeId, employeeId));
    if (data.deductions && Array.isArray(data.deductions)) {
      for (const ded of data.deductions) {
        if (!ded.name || !ded.amount) continue;

        let typeRecord = await tx
          .select()
          .from(deductionType)
          .where(eq(deductionType.companyId, data.companyId))
          .then((res) => res.find((r) => r.name.toLowerCase() === ded.name.toLowerCase()));

        if (!typeRecord) {
          const typeId = `dt_${Math.random().toString(36).substring(2, 11)}`;
          const [newType] = await tx
            .insert(deductionType)
            .values({
              id: typeId,
              companyId: data.companyId,
              name: ded.name,
              category: ded.category || "voluntary",
            })
            .returning();
          if (!newType) {
            throw new Error(`Failed to create deduction type for ${ded.name}`);
          }
          typeRecord = newType;
        }

        const empDedId = `ed_${Math.random().toString(36).substring(2, 11)}`;
        await tx.insert(employeeDeduction).values({
          id: empDedId,
          employeeId,
          deductionTypeId: typeRecord.id,
          amount: ded.amount,
          frequency: ded.frequency || "every_pay_period",
        });
      }
    }

    // 4. Save allowances
    await tx.delete(employeeAllowance).where(eq(employeeAllowance.employeeId, employeeId));
    if (data.allowances && Array.isArray(data.allowances)) {
      for (const alw of data.allowances) {
        if (!alw.name || !alw.amount) continue;

        let typeRecord = await tx
          .select()
          .from(allowanceType)
          .where(eq(allowanceType.companyId, data.companyId))
          .then((res) => res.find((r) => r.name.toLowerCase() === alw.name.toLowerCase()));

        if (!typeRecord) {
          const typeId = `at_${Math.random().toString(36).substring(2, 11)}`;
          const [newType] = await tx
            .insert(allowanceType)
            .values({
              id: typeId,
              companyId: data.companyId,
              name: alw.name,
              isTaxable: !!alw.isTaxable,
            })
            .returning();
          if (!newType) {
            throw new Error(`Failed to create allowance type for ${alw.name}`);
          }
          typeRecord = newType;
        }

        const empAlwId = `ea_${Math.random().toString(36).substring(2, 11)}`;
        await tx.insert(employeeAllowance).values({
          id: empAlwId,
          employeeId,
          allowanceTypeId: typeRecord.id,
          amount: alw.amount,
          frequency: alw.frequency || "monthly",
        });
      }
    }
  });

  revalidatePath("/hris");
  return { success: true };
}

export async function deleteEmployee(id: string) {
  await db.delete(employee).where(eq(employee.id, id));
  revalidatePath("/hris");
  return { success: true };
}
