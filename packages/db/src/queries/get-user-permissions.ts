import { eq } from "drizzle-orm";
import { db } from "../index";
import { role, rolePermission, userRole, appFeature, appModule } from "../schema";

export interface UserAppPermissions {
  isOwnerOrAdmin: boolean;
  assignedRoleName: string | null;
  featureKeys: Set<string>;
  hasModuleAccess: (moduleKey: string) => boolean;
  hasFeatureAccess: (featureKey: string) => boolean;
}

export async function getUserAppPermissions(
  userId: string
): Promise<UserAppPermissions> {
  const userRolesList = await db
    .select({
      roleId: userRole.roleId,
      roleName: role.name,
      isSystem: role.isSystem,
      featureKey: appFeature.key,
      moduleKey: appModule.key,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .leftJoin(rolePermission, eq(role.id, rolePermission.roleId))
    .leftJoin(appFeature, eq(rolePermission.featureId, appFeature.id))
    .leftJoin(appModule, eq(appFeature.appModuleId, appModule.id))
    .where(eq(userRole.userId, userId));

  // If user has no explicit custom role assigned, they are treated as owner/admin with full access
  if (userRolesList.length === 0) {
    return {
      isOwnerOrAdmin: true,
      assignedRoleName: "Owner / Admin",
      featureKeys: new Set<string>(),
      hasModuleAccess: (_moduleKey: string) => true,
      hasFeatureAccess: (_featureKey: string) => true,
    };
  }

  const roleName = userRolesList[0]?.roleName ?? null;
  const isSystemAdmin = userRolesList.some(
    (r) => r.isSystem && r.roleName.toLowerCase().includes("admin")
  );

  if (isSystemAdmin) {
    return {
      isOwnerOrAdmin: true,
      assignedRoleName: roleName,
      featureKeys: new Set<string>(),
      hasModuleAccess: (_moduleKey: string) => true,
      hasFeatureAccess: (_featureKey: string) => true,
    };
  }

  const featureKeys = new Set<string>();
  const moduleKeys = new Set<string>();

  for (const r of userRolesList) {
    if (r.moduleKey) {
      moduleKeys.add(r.moduleKey);
    }
    if (r.featureKey) {
      featureKeys.add(r.featureKey);
      if (r.moduleKey && !r.featureKey.startsWith(`${r.moduleKey}.`)) {
        featureKeys.add(`${r.moduleKey}.${r.featureKey}`);
      }
    }
  }

  return {
    isOwnerOrAdmin: false,
    assignedRoleName: roleName,
    featureKeys,
    hasModuleAccess: (moduleKey: string) => {
      if (moduleKeys.has(moduleKey)) return true;
      const prefix = `${moduleKey}.`;
      for (const key of featureKeys) {
        if (key === moduleKey || key.startsWith(prefix)) return true;
      }
      return false;
    },
    hasFeatureAccess: (featureKey: string) => featureKeys.has(featureKey),
  };
}
