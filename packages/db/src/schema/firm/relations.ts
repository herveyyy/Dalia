import { relations } from "drizzle-orm/relations";
import { user } from "../auth/tables";
import { company, workspace } from "./tables";
import { employee, deductionType, allowanceType, taxType, jobPosting, department } from "../employee/tables";
import { role } from "../rbac/tables";

export const companyRelations = relations(company, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [company.createdBy],
    references: [user.id],
  }),
  employees: many(employee),
  deductionTypes: many(deductionType),
  allowanceTypes: many(allowanceType),
  taxTypes: many(taxType),
  jobPostings: many(jobPosting),
  departments: many(department),
  roles: many(role),
  workspaces: many(workspace),
}));

export const workspaceRelations = relations(workspace, ({ one }) => ({
  company: one(company, {
    fields: [workspace.companyId],
    references: [company.id],
  }),
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
