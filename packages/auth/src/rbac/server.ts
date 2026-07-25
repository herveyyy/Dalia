import { cache } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db, rolePermission, appFeature, userRole, eq } from "@repo/db";
import { auth } from "../auth";
import type { FeatureKey, UserPermissions } from "./types";

export const getTenantPermissions = cache(async (companyId?: string | null): Promise<{
  session: typeof auth.$Infer.Session | null;
  companyId: string | null;
  permissions: Set<FeatureKey>;
}> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { session: null, companyId: null, permissions: new Set<FeatureKey>() };
  }

  const resolvedCompanyId = companyId ?? session.user.companyId ?? null;

  const permissionsList = await db
    .select({ key: appFeature.key })
    .from(userRole)
    .innerJoin(rolePermission, eq(userRole.roleId, rolePermission.roleId))
    .innerJoin(appFeature, eq(rolePermission.featureId, appFeature.id))
    .where(eq(userRole.userId, session.user.id));

  const permissions = new Set<FeatureKey>(permissionsList.map((p) => p.key as FeatureKey));
  return { session, companyId: resolvedCompanyId, permissions };
});

export async function enforcePermission(featureKey: FeatureKey, companyId?: string | null) {
  const { session, companyId: resolved, permissions } = await getTenantPermissions(companyId);

  if (!session || !permissions.has(featureKey)) {
    redirect("/403");
  }

  return { session, companyId: resolved, permissions };
}

export async function assertPermission(featureKey: FeatureKey, companyId?: string | null) {
  const { session, companyId: resolved, permissions } = await getTenantPermissions(companyId);

  if (!session || !permissions.has(featureKey)) {
    throw new Error(`Unauthorized: Missing permission '${featureKey}'`);
  }

  return { session, companyId: resolved, permissions };
}
