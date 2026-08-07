"use server";

import {
  db,
  department,
  branch,
  employee,
  eq,
  and,
  role,
  rolePermission,
  logActivity,
} from "@repo/db";
import { revalidatePath } from "next/cache";
import { resolveTenantCompanyId } from "../lib/resolve-tenant-company";

function revalidateOrg(companyId: string) {
  revalidatePath("/workspace/employees");
  revalidatePath("/workspace/departments");
  revalidatePath("/workspace/branches");
  revalidatePath("/workspace/roles");
  revalidatePath("/hris");
  revalidatePath("/hris/departments");
  revalidatePath("/hris/branches");
  revalidatePath("/hris/roles");
  revalidatePath("/hris/activity-logs");
  revalidatePath(`/workspace/employees?company_id=${companyId}`);
  revalidatePath(`/workspace/departments?company_id=${companyId}`);
  revalidatePath(`/workspace/branches?company_id=${companyId}`);
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
  const session = await assertCompanyAccess(data.companyId);
  const name = data.name.trim();
  if (!name) throw new Error("Department name is required");

  let oldRecord: any = null;
  let newRecord: any = null;
  let deptId = data.id ?? null;

  if (data.id) {
    [oldRecord] = await db
      .select()
      .from(department)
      .where(and(eq(department.id, data.id), eq(department.companyId, data.companyId)));

    [newRecord] = await db
      .update(department)
      .set({
        name,
        description: data.description?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(department.id, data.id), eq(department.companyId, data.companyId)))
      .returning();
  } else {
    [newRecord] = await db
      .insert(department)
      .values({
        companyId: data.companyId,
        name,
        description: data.description?.trim() || null,
      })
      .returning();
    deptId = newRecord?.id ?? null;
  }

  if (deptId && newRecord) {
    await logActivity(db, {
      companyId: data.companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "department",
      entityId: deptId,
      action: data.id ? "UPDATE" : "CREATE",
      summary: data.id ? `Updated department "${name}"` : `Created department "${name}"`,
      oldData: oldRecord || null,
      newData: newRecord || null,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Department saved" };
}

export async function deleteDepartmentAction(id: string, companyId: string) {
  const session = await assertCompanyAccess(companyId);

  const [oldRecord] = await db
    .select()
    .from(department)
    .where(and(eq(department.id, id), eq(department.companyId, companyId)));

  const [newRecord] = await db
    .update(department)
    .set({ isArchived: true, updatedAt: new Date().toISOString() })
    .where(and(eq(department.id, id), eq(department.companyId, companyId)))
    .returning();

  if (oldRecord && newRecord) {
    await logActivity(db, {
      companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "department",
      entityId: id,
      action: "ARCHIVE",
      summary: `Archived department "${oldRecord.name}"`,
      oldData: oldRecord,
      newData: newRecord,
    });
  }

  revalidateOrg(companyId);
  return { success: true, message: "Department archived" };
}

export async function saveBranchAction(data: {
  id?: string | null;
  companyId: string;
  name: string;
  code?: string | null;
  address?: string | null;
  description?: string | null;
}) {
  const session = await assertCompanyAccess(data.companyId);
  const name = data.name.trim();
  if (!name) throw new Error("Branch name is required");

  let oldRecord: any = null;
  let newRecord: any = null;
  let branchId = data.id ?? null;

  if (data.id) {
    [oldRecord] = await db
      .select()
      .from(branch)
      .where(and(eq(branch.id, data.id), eq(branch.companyId, data.companyId)));

    [newRecord] = await db
      .update(branch)
      .set({
        name,
        code: data.code?.trim() || null,
        address: data.address?.trim() || null,
        description: data.description?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(branch.id, data.id), eq(branch.companyId, data.companyId)))
      .returning();
  } else {
    [newRecord] = await db
      .insert(branch)
      .values({
        companyId: data.companyId,
        name,
        code: data.code?.trim() || null,
        address: data.address?.trim() || null,
        description: data.description?.trim() || null,
      })
      .returning();
    branchId = newRecord?.id ?? null;
  }

  if (branchId && newRecord) {
    await logActivity(db, {
      companyId: data.companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "branch",
      entityId: branchId,
      action: data.id ? "UPDATE" : "CREATE",
      summary: data.id ? `Updated branch "${name}"` : `Created branch "${name}"`,
      oldData: oldRecord || null,
      newData: newRecord || null,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Branch saved" };
}

export async function deleteBranchAction(id: string, companyId: string) {
  const session = await assertCompanyAccess(companyId);

  const [oldRecord] = await db
    .select()
    .from(branch)
    .where(and(eq(branch.id, id), eq(branch.companyId, companyId)));

  const [newRecord] = await db
    .update(branch)
    .set({ isArchived: true, updatedAt: new Date().toISOString() })
    .where(and(eq(branch.id, id), eq(branch.companyId, companyId)))
    .returning();

  if (oldRecord && newRecord) {
    await logActivity(db, {
      companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "branch",
      entityId: id,
      action: "ARCHIVE",
      summary: `Archived branch "${oldRecord.name}"`,
      oldData: oldRecord,
      newData: newRecord,
    });
  }

  revalidateOrg(companyId);
  return { success: true, message: "Branch archived" };
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
  let oldRecord: any = null;
  let newRecord: any = null;

  if (roleId) {
    [oldRecord] = await db
      .select()
      .from(role)
      .where(and(eq(role.id, roleId), eq(role.companyId, data.companyId)));

    [newRecord] = await db
      .update(role)
      .set({
        name,
        description: data.description?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(role.id, roleId), eq(role.companyId, data.companyId)))
      .returning();
  } else {
    [newRecord] = await db
      .insert(role)
      .values({
        companyId: data.companyId,
        name,
        description: data.description?.trim() || null,
        createdBy: session.user.id,
      })
      .returning();
    roleId = newRecord?.id ?? null;
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

  if (roleId && newRecord) {
    await logActivity(db, {
      companyId: data.companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "role",
      entityId: roleId,
      action: data.id ? "UPDATE" : "CREATE",
      summary: data.id ? `Updated role "${name}"` : `Created role "${name}"`,
      oldData: oldRecord || null,
      newData: newRecord || null,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Role saved" };
}

export async function deleteRoleAction(id: string, companyId: string) {
  const session = await assertCompanyAccess(companyId);

  const [oldRecord] = await db
    .select()
    .from(role)
    .where(and(eq(role.id, id), eq(role.companyId, companyId)));

  await db.delete(role).where(and(eq(role.id, id), eq(role.companyId, companyId)));

  if (oldRecord) {
    await logActivity(db, {
      companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "role",
      entityId: id,
      action: "DELETE",
      summary: `Deleted role "${oldRecord.name}"`,
      oldData: oldRecord,
      newData: null,
    });
  }

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
  branchId?: string | null;
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
    branchId: data.branchId || null,
    roleId: data.roleId || null,
    jobTitle: data.jobTitle?.trim() || null,
    employmentStatus: data.employmentStatus?.trim() || "Active",
    companyId: data.companyId,
    updatedAt: new Date().toISOString(),
  };

  let employeeId = data.id ?? null;
  let oldRecord: any = null;
  let newRecord: any = null;

  if (employeeId) {
    [oldRecord] = await db
      .select()
      .from(employee)
      .where(and(eq(employee.id, employeeId), eq(employee.companyId, data.companyId)));

    [newRecord] = await db
      .update(employee)
      .set(values)
      .where(and(eq(employee.id, employeeId), eq(employee.companyId, data.companyId)))
      .returning();
  } else {
    [newRecord] = await db.insert(employee).values(values).returning();
    employeeId = newRecord?.id ?? null;
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

  if (employeeId && newRecord) {
    await logActivity(db, {
      companyId: data.companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "employee",
      entityId: employeeId,
      action: data.id ? "UPDATE" : "CREATE",
      summary: data.id
        ? `Updated employee ${firstName} ${lastName}`
        : `Created employee ${firstName} ${lastName}`,
      oldData: oldRecord || null,
      newData: newRecord || null,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Employee saved" };
}

export async function deleteEmployeeAction(id: string, companyId: string) {
  const session = await assertCompanyAccess(companyId);

  const [oldRecord] = await db
    .select()
    .from(employee)
    .where(and(eq(employee.id, id), eq(employee.companyId, companyId)));

  await db
    .delete(employee)
    .where(and(eq(employee.id, id), eq(employee.companyId, companyId)));

  if (oldRecord) {
    await logActivity(db, {
      companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "employee",
      entityId: id,
      action: "DELETE",
      summary: `Removed employee ${oldRecord.firstName} ${oldRecord.lastName}`,
      oldData: oldRecord,
      newData: null,
    });
  }

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

  const [oldRecord] = await db
    .select()
    .from(employee)
    .where(and(eq(employee.id, data.employeeId), eq(employee.companyId, data.companyId)));

  const [newRecord] = await db
    .update(employee)
    .set({
      departmentId: data.departmentId || null,
      roleId: data.roleId || null,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(employee.id, data.employeeId), eq(employee.companyId, data.companyId)))
    .returning();

  const { syncEmployeeLoginRole } = await import("./employee-login-actions");
  await syncEmployeeLoginRole({
    companyId: data.companyId,
    employeeId: data.employeeId,
    roleId: data.roleId || null,
    assignedBy: session.user.id,
  });

  if (oldRecord && newRecord) {
    await logActivity(db, {
      companyId: data.companyId,
      actorId: session.user.id,
      actorName: session.user.name,
      actorEmail: session.user.email,
      entityType: "employee",
      entityId: data.employeeId,
      action: "UPDATE",
      summary: `Updated department/role assignments for employee ${oldRecord.firstName} ${oldRecord.lastName}`,
      oldData: oldRecord,
      newData: newRecord,
    });
  }

  revalidateOrg(data.companyId);
  return { success: true, message: "Assignment updated" };
}

export async function getCompanyDashboardStatsAction(companyId: string) {
  await assertCompanyAccess(companyId);

  const [branchesList, departmentsList, employeesList] = await Promise.all([
    db
      .select({
        id: branch.id,
        name: branch.name,
        code: branch.code,
        address: branch.address,
      })
      .from(branch)
      .where(and(eq(branch.companyId, companyId), eq(branch.isArchived, false))),
    db
      .select({ id: department.id, name: department.name })
      .from(department)
      .where(and(eq(department.companyId, companyId), eq(department.isArchived, false))),
    db
      .select({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        branchId: employee.branchId,
        departmentId: employee.departmentId,
        employmentStatus: employee.employmentStatus,
      })
      .from(employee)
      .where(eq(employee.companyId, companyId)),
  ]);

  const totalEmployees = employeesList.length;
  const activeEmployees = employeesList.filter((e) => e.employmentStatus === "Active").length;

  const branchBreakdown = branchesList.map((b) => {
    const branchEmployees = employeesList.filter((e) => e.branchId === b.id);
    return {
      ...b,
      employeeCount: branchEmployees.length,
    };
  });

  const unassignedBranchCount = employeesList.filter((e) => !e.branchId).length;

  return {
    totalEmployees,
    activeEmployees,
    totalBranches: branchesList.length,
    totalDepartments: departmentsList.length,
    branchBreakdown,
    unassignedBranchCount,
  };
}

export async function getFirmDashboardStatsAction(firmCompanyId: string) {
  const { session } = await resolveTenantCompanyId(firmCompanyId);
  if (!session) throw new Error("Unauthorized");

  const { workspace: workspaceTable } = await import("@repo/db");

  const clientWorkspaces = await db
    .select({
      id: workspaceTable.id,
      name: workspaceTable.name,
      businessType: workspaceTable.businessType,
      adminEmail: workspaceTable.adminEmail,
    })
    .from(workspaceTable)
    .where(eq(workspaceTable.companyId, firmCompanyId));

  const clientCompanyIds = clientWorkspaces.map((w) => w.id);

  if (clientCompanyIds.length === 0) {
    return {
      totalClients: 0,
      totalEmployees: 0,
      clientStats: [],
    };
  }

  const { inArray } = await import("@repo/db");

  const [allEmployees, allBranches] = await Promise.all([
    db
      .select({ id: employee.id, companyId: employee.companyId })
      .from(employee)
      .where(inArray(employee.companyId, clientCompanyIds)),
    db
      .select({ id: branch.id, companyId: branch.companyId })
      .from(branch)
      .where(and(inArray(branch.companyId, clientCompanyIds), eq(branch.isArchived, false))),
  ]);

  const clientStats = clientWorkspaces.map((client) => {
    const empCount = allEmployees.filter((e) => e.companyId === client.id).length;
    const branchCount = allBranches.filter((b) => b.companyId === client.id).length;
    return {
      ...client,
      employeeCount: empCount,
      branchCount: branchCount > 0 ? branchCount : 1,
    };
  });

  return {
    totalClients: clientWorkspaces.length,
    totalEmployees: allEmployees.length,
    clientStats,
  };
}
