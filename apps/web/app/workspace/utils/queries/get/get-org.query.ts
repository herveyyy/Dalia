import {
  and,
  asc,
  branch,
  db,
  department,
  eq,
  role,
  employee,
  rolePermission,
  appModule,
  appFeature,
} from "@repo/db";

export async function getDepartments(companyId: string) {
  return db
    .select()
    .from(department)
    .where(and(eq(department.companyId, companyId), eq(department.isArchived, false)))
    .orderBy(asc(department.name));
}

export async function getBranches(companyId: string) {
  return db
    .select()
    .from(branch)
    .where(and(eq(branch.companyId, companyId), eq(branch.isArchived, false)))
    .orderBy(asc(branch.name));
}

export async function getRoles(companyId: string) {
  const rows = await db
    .select({
      id: role.id,
      companyId: role.companyId,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      createdBy: role.createdBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permission: {
        featureId: rolePermission.featureId,
      },
    })
    .from(role)
    .leftJoin(rolePermission, eq(role.id, rolePermission.roleId))
    .where(eq(role.companyId, companyId))
    .orderBy(asc(role.name));

  const roleMap = new Map<string, any>();
  for (const row of rows) {
    if (!roleMap.has(row.id)) {
      roleMap.set(row.id, {
        id: row.id,
        companyId: row.companyId,
        name: row.name,
        description: row.description,
        isSystem: row.isSystem,
        createdBy: row.createdBy,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        permissions: [],
      });
    }
    if (row.permission && row.permission.featureId) {
      roleMap.get(row.id).permissions.push({ featureId: row.permission.featureId });
    }
  }

  return Array.from(roleMap.values()) as Array<
    typeof role.$inferSelect & {
      permissions: { featureId: string }[];
    }
  >;
}

export async function getAppAccessCatalog() {
  const rows = await db
    .select({
      moduleId: appModule.id,
      moduleKey: appModule.key,
      moduleName: appModule.name,
      moduleDescription: appModule.description,
      moduleSortOrder: appModule.sortOrder,
      moduleIsActive: appModule.isActive,
      moduleCreatedAt: appModule.createdAt,
      moduleUpdatedAt: appModule.updatedAt,
      featureId: appFeature.id,
      featureModuleId: appFeature.appModuleId,
      featureKey: appFeature.key,
      featureName: appFeature.name,
      featureDescription: appFeature.description,
      featureSortOrder: appFeature.sortOrder,
      featureIsActive: appFeature.isActive,
      featureCreatedAt: appFeature.createdAt,
      featureUpdatedAt: appFeature.updatedAt,
    })
    .from(appModule)
    .leftJoin(
      appFeature,
      and(eq(appModule.id, appFeature.appModuleId), eq(appFeature.isActive, true))
    )
    .where(eq(appModule.isActive, true))
    .orderBy(
      asc(appModule.sortOrder),
      asc(appModule.name),
      asc(appFeature.sortOrder),
      asc(appFeature.name)
    );

  const moduleMap = new Map<string, any>();
  for (const row of rows) {
    if (!moduleMap.has(row.moduleId)) {
      moduleMap.set(row.moduleId, {
        id: row.moduleId,
        key: row.moduleKey,
        name: row.moduleName,
        description: row.moduleDescription,
        sortOrder: row.moduleSortOrder,
        isActive: row.moduleIsActive,
        createdAt: row.moduleCreatedAt,
        updatedAt: row.moduleUpdatedAt,
        features: [],
      });
    }
    if (row.featureId) {
      moduleMap.get(row.moduleId).features.push({
        id: row.featureId,
        appModuleId: row.featureModuleId,
        key: row.featureKey,
        name: row.featureName,
        description: row.featureDescription,
        sortOrder: row.featureSortOrder,
        isActive: row.featureIsActive,
        createdAt: row.featureCreatedAt,
        updatedAt: row.featureUpdatedAt,
      });
    }
  }

  return Array.from(moduleMap.values()) as Array<
    typeof appModule.$inferSelect & {
      features: (typeof appFeature.$inferSelect)[];
    }
  >;
}

export async function getEmployees(companyId: string) {
  const rows = await db
    .select({
      employee: employee,
      department: department,
      branch: branch,
      role: role,
    })
    .from(employee)
    .leftJoin(department, eq(employee.departmentId, department.id))
    .leftJoin(branch, eq(employee.branchId, branch.id))
    .leftJoin(role, eq(employee.roleId, role.id))
    .where(eq(employee.companyId, companyId))
    .orderBy(asc(employee.lastName), asc(employee.firstName));

  return rows.map((row) => ({
    ...row.employee,
    department: row.department,
    branch: row.branch,
    role: row.role,
  })) as Array<
    typeof employee.$inferSelect & {
      department: typeof department.$inferSelect | null;
      branch: typeof branch.$inferSelect | null;
      role: typeof role.$inferSelect | null;
    }
  >;
}

export async function getDepartmentsWithEmployees(companyId: string) {
  const rows = await db
    .select({
      department: department,
      employee: employee,
      role: role,
      branch: branch,
    })
    .from(department)
    .leftJoin(employee, eq(department.id, employee.departmentId))
    .leftJoin(role, eq(employee.roleId, role.id))
    .leftJoin(branch, eq(employee.branchId, branch.id))
    .where(and(eq(department.companyId, companyId), eq(department.isArchived, false)))
    .orderBy(
      asc(department.name),
      asc(employee.lastName),
      asc(employee.firstName)
    );

  const deptMap = new Map<string, any>();
  for (const row of rows) {
    if (!deptMap.has(row.department.id)) {
      deptMap.set(row.department.id, {
        ...row.department,
        employees: [],
      });
    }
    if (row.employee && row.employee.id) {
      deptMap.get(row.department.id).employees.push({
        ...row.employee,
        role: row.role,
        branch: row.branch,
      });
    }
  }

  return Array.from(deptMap.values()) as Array<
    typeof department.$inferSelect & {
      employees: Array<
        typeof employee.$inferSelect & {
          role: typeof role.$inferSelect | null;
          branch: typeof branch.$inferSelect | null;
        }
      >;
    }
  >;
}

export async function getBranchesWithEmployees(companyId: string) {
  const rows = await db
    .select({
      branch: branch,
      employee: employee,
      department: department,
      role: role,
    })
    .from(branch)
    .leftJoin(employee, eq(branch.id, employee.branchId))
    .leftJoin(department, eq(employee.departmentId, department.id))
    .leftJoin(role, eq(employee.roleId, role.id))
    .where(and(eq(branch.companyId, companyId), eq(branch.isArchived, false)))
    .orderBy(
      asc(branch.name),
      asc(employee.lastName),
      asc(employee.firstName)
    );

  const branchMap = new Map<string, any>();
  for (const row of rows) {
    if (!branchMap.has(row.branch.id)) {
      branchMap.set(row.branch.id, {
        ...row.branch,
        employees: [],
      });
    }
    if (row.employee && row.employee.id) {
      branchMap.get(row.branch.id).employees.push({
        ...row.employee,
        department: row.department,
        role: row.role,
      });
    }
  }

  return Array.from(branchMap.values()) as Array<
    typeof branch.$inferSelect & {
      employees: Array<
        typeof employee.$inferSelect & {
          department: typeof department.$inferSelect | null;
          role: typeof role.$inferSelect | null;
        }
      >;
    }
  >;
}

export type WorkspaceEmployee = Awaited<ReturnType<typeof getEmployees>>[number];
export type WorkspaceDepartment = Awaited<ReturnType<typeof getDepartments>>[number];
export type WorkspaceBranch = Awaited<ReturnType<typeof getBranches>>[number];
export type WorkspaceRole = Awaited<ReturnType<typeof getRoles>>[number];
export type AppAccessCatalog = Awaited<ReturnType<typeof getAppAccessCatalog>>;
export type DepartmentWithEmployees = Awaited<
  ReturnType<typeof getDepartmentsWithEmployees>
>[number];
export type BranchWithEmployees = Awaited<
  ReturnType<typeof getBranchesWithEmployees>
>[number];
