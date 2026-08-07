import { relations } from "drizzle-orm/relations";
import { user } from "../auth/tables";
import { company } from "../firm/tables";
import { activityLog } from "./tables";

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  actor: one(user, {
    fields: [activityLog.actorId],
    references: [user.id],
  }),
  company: one(company, {
    fields: [activityLog.companyId],
    references: [company.id],
  }),
}));
