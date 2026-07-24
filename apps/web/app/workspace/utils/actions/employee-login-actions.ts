"use server";

import { auth } from "@repo/auth";
import {
  account,
  and,
  db,
  employee,
  eq,
  inArray,
  role,
  user,
  userRole,
} from "@repo/db";
import { revalidatePath } from "next/cache";
import { resolveTenantCompanyId } from "../lib/resolve-tenant-company";

function revalidateEmployees(companyId: string) {
  revalidatePath("/workspace/employees");
  revalidatePath(`/workspace/employees?company_id=${companyId}`);
}

async function assertClientCompanyAccess(companyId: string) {
  const { session, companyId: resolved, error } = await resolveTenantCompanyId(companyId);
  if (!session || error || resolved !== companyId) {
    throw new Error("Unauthorized");
  }
  return session;
}

async function syncEmployeeUserRole(opts: {
  userId: string;
  companyId: string;
  roleId: string | null;
  assignedBy: string;
}) {
  const existing = await db
    .select({ id: userRole.id })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(and(eq(userRole.userId, opts.userId), eq(role.companyId, opts.companyId)));

  if (existing.length > 0) {
    await db.delete(userRole).where(
      inArray(
        userRole.id,
        existing.map((r) => r.id)
      )
    );
  }

  if (opts.roleId) {
    const [valid] = await db
      .select({ id: role.id })
      .from(role)
      .where(and(eq(role.id, opts.roleId), eq(role.companyId, opts.companyId)))
      .limit(1);
    if (!valid) throw new Error("Role is not valid for this company");

    await db.insert(userRole).values({
      userId: opts.userId,
      roleId: opts.roleId,
      assignedBy: opts.assignedBy,
    });
  }
}

export async function createEmployeeLoginAction(data: {
  companyId: string;
  employeeId: string;
  password: string;
  email?: string | null;
}) {
  const session = await assertClientCompanyAccess(data.companyId);

  if (data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const [emp] = await db
    .select()
    .from(employee)
    .where(and(eq(employee.id, data.employeeId), eq(employee.companyId, data.companyId)))
    .limit(1);

  if (!emp) throw new Error("Employee not found");
  if (emp.userId) throw new Error("This employee already has a login");

  const email = (data.email?.trim() || emp.workEmail || emp.personalEmail || "")
    .toLowerCase();
  if (!email) {
    throw new Error("Add a work email before creating a login");
  }

  const [existingUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  const ctx = await auth.$context;
  const hashedPassword = await ctx.password.hash(data.password);
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();
  const name = `${emp.firstName} ${emp.lastName}`.trim();

  await db.insert(user).values({
    id: userId,
    name,
    email,
    emailVerified: true,
    companyId: data.companyId,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  await db
    .update(employee)
    .set({
      userId,
      workEmail: emp.workEmail || email,
      updatedAt: now,
    })
    .where(eq(employee.id, emp.id));

  if (emp.roleId) {
    await syncEmployeeUserRole({
      userId,
      companyId: data.companyId,
      roleId: emp.roleId,
      assignedBy: session.user.id,
    });
  }

  revalidateEmployees(data.companyId);
  return { success: true, message: "Login created", userId, email };
}

export async function resetEmployeePasswordAction(data: {
  companyId: string;
  employeeId: string;
  password: string;
}) {
  await assertClientCompanyAccess(data.companyId);

  if (data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const [emp] = await db
    .select({ id: employee.id, userId: employee.userId })
    .from(employee)
    .where(and(eq(employee.id, data.employeeId), eq(employee.companyId, data.companyId)))
    .limit(1);

  if (!emp?.userId) throw new Error("Employee has no login yet");

  const ctx = await auth.$context;
  const hashedPassword = await ctx.password.hash(data.password);
  const now = new Date().toISOString();

  const [credentialAccount] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, emp.userId), eq(account.providerId, "credential")))
    .limit(1);

  if (credentialAccount) {
    await db
      .update(account)
      .set({ password: hashedPassword, updatedAt: now })
      .where(eq(account.id, credentialAccount.id));
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: emp.userId,
      providerId: "credential",
      userId: emp.userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
  }

  revalidateEmployees(data.companyId);
  return { success: true, message: "Password updated" };
}

export async function revokeEmployeeLoginAction(data: {
  companyId: string;
  employeeId: string;
}) {
  const session = await assertClientCompanyAccess(data.companyId);

  const [emp] = await db
    .select()
    .from(employee)
    .where(and(eq(employee.id, data.employeeId), eq(employee.companyId, data.companyId)))
    .limit(1);

  if (!emp?.userId) throw new Error("Employee has no login");
  if (emp.userId === session.user.id) {
    throw new Error("You cannot revoke your own login from here");
  }

  const userId = emp.userId;

  await db
    .update(employee)
    .set({ userId: null, updatedAt: new Date().toISOString() })
    .where(eq(employee.id, emp.id));

  // Delete auth user (cascades account/session/user_role)
  await db.delete(user).where(eq(user.id, userId));

  revalidateEmployees(data.companyId);
  return { success: true, message: "Login revoked" };
}

/** Keep user_role in sync when employee.roleId changes and they have a login. */
export async function syncEmployeeLoginRole(opts: {
  companyId: string;
  employeeId: string;
  roleId: string | null;
  assignedBy: string;
}) {
  const [emp] = await db
    .select({ userId: employee.userId })
    .from(employee)
    .where(and(eq(employee.id, opts.employeeId), eq(employee.companyId, opts.companyId)))
    .limit(1);

  if (!emp?.userId) return;

  await syncEmployeeUserRole({
    userId: emp.userId,
    companyId: opts.companyId,
    roleId: opts.roleId,
    assignedBy: opts.assignedBy,
  });
}
