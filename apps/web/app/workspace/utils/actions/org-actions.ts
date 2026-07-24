"use server";

import {
  db,
  department,
  employee,
  eq,
  and,
  role,
  rolePermission,
} from "@repo/db";
import { revalidatePath } from "next/cache";
import { resolveTenantCompanyId } from "../lib/resolve-tenant-company";

function revalidateOrg(companyId: string) {
  revalidatePath("/workspace/employees");
  revalidatePath("/workspace/departments");
  revalidatePath("/workspace/roles");
  revalidatePath(`/workspace/employees?company_id=${companyId}`);
  revalidatePath(`/workspace/departments?company_id=${companyId}`);
  revalidatePath(`/workspace/roles?company_id=${companyId}`);
}

async function assertCompanyAccess(companyId: string) {
  const { session, companyId: resolved, error } = await resolveTenantCompanyId(companyId);
  if (!session || error || resolved !== companyId) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function saveDepartmentAction(data: {
  id?: string | null;
  companyId: string;
  name: string;
  description?: string | null;
}) {
  await assertCompanyAccess(data.companyId);
  const name = data.name.trim();
  if (!name) throw new Error("Department name is required");

  if (data.id) {
    await db
      .update(department)
      .set({
        name,
        description: data.description?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(department.id, data.id), eq(department.companyId, data.companyId)));
  } else {
    await db.insert(department).values({
      companyId: data.companyId,
      name,
      description: data.description?.trim() || null,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Department saved" };
}

export async function deleteDepartmentAction(id: string, companyId: string) {
  await assertCompanyAccess(companyId);
  await db
    .update(department)
    .set({ isArchived: true, updatedAt: new Date().toISOString() })
    .where(and(eq(department.id, id), eq(department.companyId, companyId)));
  revalidateOrg(companyId);
  return { success: true, message: "Department archived" };
}

export async function saveRoleAction(data: {
  id?: string | null;
  companyId: string;
  name: string;
  description?: string | null;
  featureIds?: string[];
}) {
  const session = await assertCompanyAccess(data.companyId);
  const name = data.name.trim();
  if (!name) throw new Error("Role name is required");

  const featureIds = [...new Set(data.featureIds ?? [])];

  let roleId = data.id ?? null;

  if (roleId) {
    await db
      .update(role)
      .set({
        name,
        description: data.description?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(role.id, roleId), eq(role.companyId, data.companyId)));
  } else {
    const [created] = await db
      .insert(role)
      .values({
        companyId: data.companyId,
        name,
        description: data.description?.trim() || null,
        createdBy: session.user.id,
      })
      .returning({ id: role.id });
    roleId = created?.id ?? null;
  }

  if (!roleId) throw new Error("Failed to save role");

  await db.delete(rolePermission).where(eq(rolePermission.roleId, roleId));
  if (featureIds.length > 0) {
    await db.insert(rolePermission).values(
      featureIds.map((featureId) => ({
        roleId: roleId!,
        featureId,
      }))
    );
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Role saved" };
}

export async function deleteRoleAction(id: string, companyId: string) {
  await assertCompanyAccess(companyId);
  await db.delete(role).where(and(eq(role.id, id), eq(role.companyId, companyId)));
  revalidateOrg(companyId);
  return { success: true, message: "Role deleted" };
}

export async function saveEmployeeAction(data: {
  id?: string | null;
  companyId: string;
  firstName: string;
  lastName: string;
  workEmail?: string | null;
  departmentId?: string | null;
  roleId?: string | null;
  jobTitle?: string | null;
  employmentStatus?: string | null;
}) {
  const session = await assertCompanyAccess(data.companyId);
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  if (!firstName || !lastName) throw new Error("First and last name are required");

  const values = {
    firstName,
    lastName,
    workEmail: data.workEmail?.trim() || null,
    departmentId: data.departmentId || null,
    roleId: data.roleId || null,
    jobTitle: data.jobTitle?.trim() || null,
    employmentStatus: data.employmentStatus?.trim() || "Active",
    companyId: data.companyId,
    updatedAt: new Date().toISOString(),
  };

  let employeeId = data.id ?? null;

  if (employeeId) {
    await db
      .update(employee)
      .set(values)
      .where(and(eq(employee.id, employeeId), eq(employee.companyId, data.companyId)));
  } else {
    const [created] = await db.insert(employee).values(values).returning({ id: employee.id });
    employeeId = created?.id ?? null;
  }

  if (employeeId) {
    const { syncEmployeeLoginRole } = await import("./employee-login-actions");
    await syncEmployeeLoginRole({
      companyId: data.companyId,
      employeeId,
      roleId: data.roleId || null,
      assignedBy: session.user.id,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Employee saved" };
}

export async function deleteEmployeeAction(id: string, companyId: string) {
  await assertCompanyAccess(companyId);
  await db
    .delete(employee)
    .where(and(eq(employee.id, id), eq(employee.companyId, companyId)));
  revalidateOrg(companyId);
  return { success: true, message: "Employee removed" };
}

export async function assignEmployeeAction(data: {
  employeeId: string;
  companyId: string;
  departmentId?: string | null;
  roleId?: string | null;
}) {
  const session = await assertCompanyAccess(data.companyId);
  await db
    .update(employee)
    .set({
      departmentId: data.departmentId || null,
      roleId: data.roleId || null,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(employee.id, data.employeeId), eq(employee.companyId, data.companyId)));

  const { syncEmployeeLoginRole } = await import("./employee-login-actions");
  await syncEmployeeLoginRole({
    companyId: data.companyId,
    employeeId: data.employeeId,
    roleId: data.roleId || null,
    assignedBy: session.user.id,
  });

  revalidateOrg(data.companyId);
  return { success: true, message: "Assignment updated" };
}
