"use server";

import { auth } from "@repo/auth";
import { account, and, db, eq, inArray, role, user, userRole } from "@repo/db";
import { revalidatePath } from "next/cache";
import { assertFirmAccess } from "../lib/assert-firm-access";

function revalidateFirmUsers(companyId: string) {
  revalidatePath("/workspace/partners");
  revalidatePath(`/workspace/partners?company_id=${companyId}`);
  revalidatePath("/workspace/roles");
  revalidatePath(`/workspace/roles?company_id=${companyId}`);
}

export async function createFirmUserAction(data: {
  companyId: string;
  name: string;
  email: string;
  password: string;
  roleIds?: string[];
}) {
  const { session, firmCompanyId } = await assertFirmAccess(data.companyId);

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing) {
    throw new Error("A user with this email already exists");
  }

  const roleIds = [...new Set(data.roleIds ?? [])];
  if (roleIds.length > 0) {
    const validRoles = await db
      .select({ id: role.id })
      .from(role)
      .where(and(eq(role.companyId, firmCompanyId), inArray(role.id, roleIds)));
    if (validRoles.length !== roleIds.length) {
      throw new Error("One or more roles are invalid for this firm");
    }
  }

  const ctx = await auth.$context;
  const hashedPassword = await ctx.password.hash(password);
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(user).values({
    id: userId,
    name,
    email,
    emailVerified: true,
    companyId: firmCompanyId,
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

  if (roleIds.length > 0) {
    await db.insert(userRole).values(
      roleIds.map((roleId) => ({
        userId,
        roleId,
        assignedBy: session.user.id,
      }))
    );
  }

  revalidateFirmUsers(firmCompanyId);
  return { success: true, message: "User created", userId };
}

export async function updateFirmUserRolesAction(data: {
  companyId: string;
  userId: string;
  roleIds: string[];
}) {
  const { session, firmCompanyId } = await assertFirmAccess(data.companyId);

  const [target] = await db
    .select({ id: user.id, companyId: user.companyId })
    .from(user)
    .where(eq(user.id, data.userId))
    .limit(1);

  if (!target || target.companyId !== firmCompanyId) {
    throw new Error("User not found in this firm");
  }

  const roleIds = [...new Set(data.roleIds)];
  if (roleIds.length > 0) {
    const validRoles = await db
      .select({ id: role.id })
      .from(role)
      .where(and(eq(role.companyId, firmCompanyId), inArray(role.id, roleIds)));
    if (validRoles.length !== roleIds.length) {
      throw new Error("One or more roles are invalid for this firm");
    }
  }

  // Remove only firm-scoped role assignments for this user
  const firmRoleRows = await db
    .select({ id: userRole.id, roleId: userRole.roleId })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(and(eq(userRole.userId, data.userId), eq(role.companyId, firmCompanyId)));

  if (firmRoleRows.length > 0) {
    await db.delete(userRole).where(
      inArray(
        userRole.id,
        firmRoleRows.map((r) => r.id)
      )
    );
  }

  if (roleIds.length > 0) {
    await db.insert(userRole).values(
      roleIds.map((roleId) => ({
        userId: data.userId,
        roleId,
        assignedBy: session.user.id,
      }))
    );
  }

  revalidateFirmUsers(firmCompanyId);
  return { success: true, message: "Roles updated" };
}

export async function resetFirmUserPasswordAction(data: {
  companyId: string;
  userId: string;
  password: string;
}) {
  await assertFirmAccess(data.companyId);

  if (data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const [target] = await db
    .select({ id: user.id, companyId: user.companyId })
    .from(user)
    .where(eq(user.id, data.userId))
    .limit(1);

  if (!target || target.companyId !== data.companyId) {
    throw new Error("User not found in this firm");
  }

  const ctx = await auth.$context;
  const hashedPassword = await ctx.password.hash(data.password);
  const now = new Date().toISOString();

  const [credentialAccount] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, data.userId), eq(account.providerId, "credential")))
    .limit(1);

  if (credentialAccount) {
    await db
      .update(account)
      .set({ password: hashedPassword, updatedAt: now })
      .where(eq(account.id, credentialAccount.id));
  } else {
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: data.userId,
      providerId: "credential",
      userId: data.userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
  }

  revalidateFirmUsers(data.companyId);
  return { success: true, message: "Password updated" };
}

export async function deleteFirmUserAction(data: {
  companyId: string;
  userId: string;
}) {
  const { session } = await assertFirmAccess(data.companyId);

  if (data.userId === session.user.id) {
    throw new Error("You cannot delete your own account");
  }

  const [target] = await db
    .select({ id: user.id, companyId: user.companyId })
    .from(user)
    .where(eq(user.id, data.userId))
    .limit(1);

  if (!target || target.companyId !== data.companyId) {
    throw new Error("User not found in this firm");
  }

  await db.delete(user).where(eq(user.id, data.userId));
  revalidateFirmUsers(data.companyId);
  return { success: true, message: "User deleted" };
}
