import { cache } from "react";
import { redirect } from "next/navigation";
import { db, rolePermission, appFeature, userRole, eq } from "@repo/db";
import { resolveTenantCompanyId } from "./resolve-tenant-company";
import type { FeatureKey } from "./rbac-types";

export const getTenantPermissions = cache(async (companyId?: string | null) => {
  const { session, companyId: resolvedCompanyId, error } = await resolveTenantCompanyId(companyId);
  if (!session || error || !resolvedCompanyId) {
    return { session: null, companyId: null as string | null, permissions: new Set<FeatureKey>() };
  }

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
