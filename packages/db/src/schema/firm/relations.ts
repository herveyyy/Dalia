import { relations } from "drizzle-orm/relations";
import { user } from "../auth/tables";
import { company, workspace } from "./tables";

export const companyRelations = relations(company, ({ one }) => ({
  createdByUser: one(user, {
    fields: [company.createdBy],
    references: [user.id],
  }),
}));

export const workspaceRelations = relations(workspace, ({ one }) => ({
  createdByUser: one(user, {
    fields: [workspace.createdBy],
    references: [user.id],
  }),
}));

export const userCompanyRelations = relations(user, ({ one }) => ({
  company: one(company, {
    fields: [user.companyId],
    references: [company.id],
  }),
}));
