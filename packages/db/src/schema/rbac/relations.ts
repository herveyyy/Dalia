import { relations } from "drizzle-orm/relations";
import { user } from "../auth/tables";
import { company } from "../firm/tables";
import { appFeature, appModule, role, rolePermission, userRole } from "./tables";

export const roleRelations = relations(role, ({ one, many }) => ({
  company: one(company, {
    fields: [role.companyId],
    references: [company.id],
  }),
  createdByUser: one(user, {
    fields: [role.createdBy],
    references: [user.id],
    relationName: "role_created_by",
  }),
  userRoles: many(userRole),
  permissions: many(rolePermission),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.userId],
    references: [user.id],
    relationName: "user_role_user",
  }),
  role: one(role, {
    fields: [userRole.roleId],
    references: [role.id],
  }),
  assignedByUser: one(user, {
    fields: [userRole.assignedBy],
    references: [user.id],
    relationName: "user_role_assigned_by",
  }),
}));

export const appModuleRelations = relations(appModule, ({ many }) => ({
  features: many(appFeature),
}));

export const appFeatureRelations = relations(appFeature, ({ one, many }) => ({
  appModule: one(appModule, {
    fields: [appFeature.appModuleId],
    references: [appModule.id],
  }),
  rolePermissions: many(rolePermission),
}));

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
  role: one(role, {
    fields: [rolePermission.roleId],
    references: [role.id],
  }),
  feature: one(appFeature, {
    fields: [rolePermission.featureId],
    references: [appFeature.id],
  }),
}));
