import { and, asc, db, department, eq, role } from "@repo/db";

export async function getDepartments(companyId: string) {
  return db
    .select()
    .from(department)
    .where(and(eq(department.companyId, companyId), eq(department.isArchived, false)))
    .orderBy(asc(department.name));
}

export async function getRoles(companyId: string) {
  return db
    .select()
    .from(role)
    .where(eq(role.companyId, companyId))
    .orderBy(asc(role.name));
}

export async function getEmployees(companyId: string) {
  return db.query.employee.findMany({
    where: (emp, { eq: whereEq }) => whereEq(emp.companyId, companyId),
    with: {
      department: true,
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
        },
        orderBy: (emp, { asc: orderAsc }) => [orderAsc(emp.lastName), orderAsc(emp.firstName)],
      },
    },
    orderBy: (dept, { asc: orderAsc }) => [orderAsc(dept.name)],
  });
}

export type WorkspaceEmployee = Awaited<ReturnType<typeof getEmployees>>[number];
export type WorkspaceDepartment = Awaited<ReturnType<typeof getDepartments>>[number];
export type WorkspaceRole = Awaited<ReturnType<typeof getRoles>>[number];
export type DepartmentWithEmployees = Awaited<
  ReturnType<typeof getDepartmentsWithEmployees>
>[number];
