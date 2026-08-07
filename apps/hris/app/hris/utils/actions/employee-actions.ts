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
  logActivity,
} from "@repo/db";
import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
  const session = await getSafeSession(await headers());
  return session?.user ?? null;
}

export async function saveEmployee(data: any) {
  try {
    const user = await getSessionUser();
    const isUpdate = !!data.id;
    let oldRecord: any = null;
    let newRecord: any = null;

    if (isUpdate && data.id) {
      [oldRecord] = await db.select().from(employee).where(eq(employee.id, data.id));
    }

    await db.transaction(async (tx) => {
      const employeeValues = {
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
        departmentId: data.departmentId || null,
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
        taxTypeId: data.taxTypeId || null,
      };

      let employeeId: string = data.id;

      if (isUpdate) {
        [newRecord] = await tx.update(employee).set(employeeValues).where(eq(employee.id, employeeId)).returning();
      } else {
        [newRecord] = await tx.insert(employee).values(employeeValues).returning();
        if (!newRecord) {
          throw new Error("Failed to create employee");
        }
        employeeId = newRecord.id;
      }

      await tx.delete(employeeEmergencyContact).where(eq(employeeEmergencyContact.employeeId, employeeId));
      if (data.emergencyContact && data.emergencyContact.contactPerson && data.emergencyContact.contactNo) {
        await tx.insert(employeeEmergencyContact).values({
          employeeId,
          contactPerson: data.emergencyContact.contactPerson,
          contactNo: data.emergencyContact.contactNo,
          contactAddress: data.emergencyContact.contactAddress || null,
          relationship: data.emergencyContact.relationship,
        });
      }

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
            const [newType] = await tx
              .insert(deductionType)
              .values({
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

          await tx.insert(employeeDeduction).values({
            employeeId,
            deductionTypeId: typeRecord.id,
            amount: ded.amount,
            frequency: ded.frequency || "every_pay_period",
          });
        }
      }

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
            const [newType] = await tx
              .insert(allowanceType)
              .values({
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

          await tx.insert(employeeAllowance).values({
            employeeId,
            allowanceTypeId: typeRecord.id,
            amount: alw.amount,
            frequency: alw.frequency || "monthly",
          });
        }
      }

      if (newRecord) {
        await logActivity(tx, {
          companyId: data.companyId,
          actorId: user?.id,
          actorName: user?.name,
          actorEmail: user?.email,
          entityType: "employee",
          entityId: newRecord.id,
          action: isUpdate ? "UPDATE" : "CREATE",
          summary: isUpdate
            ? `Updated employee ${data.firstName} ${data.lastName}`
            : `Created employee ${data.firstName} ${data.lastName}`,
          oldData: oldRecord || null,
          newData: newRecord || null,
        });
      }
    });

    revalidatePath("/hris");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to save employee record:", error);
    throw new Error("Failed to save employee record");
  }
}

export async function deleteEmployee(id: string) {
  try {
    const user = await getSessionUser();
    const [oldRecord] = await db.select().from(employee).where(eq(employee.id, id));

    await db.delete(employee).where(eq(employee.id, id));

    if (oldRecord) {
      await logActivity(db, {
        companyId: oldRecord.companyId,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        entityType: "employee",
        entityId: id,
        action: "DELETE",
        summary: `Deleted employee record ${oldRecord.firstName} ${oldRecord.lastName}`,
        oldData: oldRecord,
        newData: null,
      });
    }

    revalidatePath("/hris");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete employee:", error);
    throw new Error("Failed to delete employee");
  }
}
