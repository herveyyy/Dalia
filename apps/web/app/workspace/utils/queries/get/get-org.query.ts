import { and, asc, branch, db, department, eq, role } from "@repo/db";

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
  return db.query.role.findMany({
    where: (r, { eq: whereEq }) => whereEq(r.companyId, companyId),
    with: {
      permissions: {
        columns: { featureId: true },
      },
    },
    orderBy: (r, { asc: orderAsc }) => [orderAsc(r.name)],
  });
}

export async function getAppAccessCatalog() {
  return db.query.appModule.findMany({
    where: (m, { eq: whereEq }) => whereEq(m.isActive, true),
    with: {
      features: {
        where: (f, { eq: whereEq }) => whereEq(f.isActive, true),
        orderBy: (f, { asc: orderAsc }) => [orderAsc(f.sortOrder), orderAsc(f.name)],
      },
    },
    orderBy: (m, { asc: orderAsc }) => [orderAsc(m.sortOrder), orderAsc(m.name)],
  });
}

export async function getEmployees(companyId: string) {
  return db.query.employee.findMany({
    where: (emp, { eq: whereEq }) => whereEq(emp.companyId, companyId),
    with: {
      department: true,
      branch: true,
      role: true,
    },
    orderBy: (emp, { asc: orderAsc }) => [orderAsc(emp.lastName), orderAsc(emp.firstName)],
  });
}

export async function getDepartmentsWithEmployees(companyId: string) {
  return db.query.department.findMany({
    where: (dept, { and: whereAnd, eq: whereEq }) =>
      whereAnd(whereEq(dept.companyId, companyId), whereEq(dept.isArchived, false)),
    with: {
      employees: {
        with: {
          role: true,
          branch: true,
        },
        orderBy: (emp, { asc: orderAsc }) => [orderAsc(emp.lastName), orderAsc(emp.firstName)],
      },
    },
    orderBy: (dept, { asc: orderAsc }) => [orderAsc(dept.name)],
  });
}

export async function getBranchesWithEmployees(companyId: string) {
  return db.query.branch.findMany({
    where: (b, { and: whereAnd, eq: whereEq }) =>
      whereAnd(whereEq(b.companyId, companyId), whereEq(b.isArchived, false)),
    with: {
      employees: {
        with: {
          department: true,
          role: true,
        },
        orderBy: (emp, { asc: orderAsc }) => [orderAsc(emp.lastName), orderAsc(emp.firstName)],
      },
    },
    orderBy: (b, { asc: orderAsc }) => [orderAsc(b.name)],
  });
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
