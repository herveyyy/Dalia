import {
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../auth/tables";
import { company } from "../firm/tables";

/**
 * Company-scoped roles. A firm can define custom roles per company they handle.
 * System roles (isSystem=true) are seeded defaults; custom roles are firm-created.
 */
export const role = pgTable(
  "role",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isSystem: boolean("is_system").default(false).notNull(),
    createdBy: text("created_by").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "role_company_id_company_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.createdBy],
      foreignColumns: [user.id],
      name: "role_created_by_user_id_fk",
    }).onDelete("cascade"),
    unique("role_company_id_name_unique").on(table.companyId, table.name),
  ],
);

/** Assigns a user to a role within a company. */
export const userRole = pgTable(
  "user_role",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    roleId: uuid("role_id").notNull(),
    assignedBy: text("assigned_by"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "user_role_user_id_user_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [role.id],
      name: "user_role_role_id_role_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.assignedBy],
      foreignColumns: [user.id],
      name: "user_role_assigned_by_user_id_fk",
    }).onDelete("set null"),
    unique("user_role_user_id_role_id_unique").on(table.userId, table.roleId),
  ],
);
