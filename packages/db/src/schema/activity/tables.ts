import {
  foreignKey,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../auth/tables";
import { company } from "../firm/tables";

export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id"),
    actorId: text("actor_id"),
    actorName: text("actor_name"),
    actorEmail: text("actor_email"),

    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(), // "CREATE" | "UPDATE" | "DELETE" | "ARCHIVE" | "RESTORE" | "BULK_UPDATE"
    summary: text("summary"),

    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),
    changes: jsonb("changes"),
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("activity_log_company_id_idx").on(table.companyId),
    index("activity_log_actor_id_idx").on(table.actorId),
    index("activity_log_entity_idx").on(table.entityType, table.entityId),
    index("activity_log_action_idx").on(table.action),
    index("activity_log_created_at_idx").on(table.createdAt),
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "activity_log_company_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.actorId],
      foreignColumns: [user.id],
      name: "activity_log_actor_id_fk",
    }).onDelete("set null"),
  ]
);

export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;
