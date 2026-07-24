import { asc, db, eq, role, user, userRole } from "@repo/db";

export async function getFirmUsers(firmCompanyId: string) {
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.companyId, firmCompanyId))
    .orderBy(asc(user.name));

  if (users.length === 0) return [];

  const assignments = await db
    .select({
      userId: userRole.userId,
      roleId: role.id,
      roleName: role.name,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(eq(role.companyId, firmCompanyId));

  const rolesByUser = new Map<string, { id: string; name: string }[]>();
  for (const row of assignments) {
    const list = rolesByUser.get(row.userId) ?? [];
    list.push({ id: row.roleId, name: row.roleName });
    rolesByUser.set(row.userId, list);
  }

  return users.map((u) => ({
    ...u,
    roles: rolesByUser.get(u.id) ?? [],
  }));
}

export type FirmUser = Awaited<ReturnType<typeof getFirmUsers>>[number];
