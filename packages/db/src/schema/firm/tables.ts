import { foreignKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const company = pgTable("company", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  websiteUrl: text("website_url"),
  headquarters: text("headquarters"),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  createdBy: text("created_by").notNull(),
});

export const workspace = pgTable(
  "workspace",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    adminEmail: text("admin_email"),
    websiteUrl: text("website_url"),
    headquarters: text("headquarters"),
    description: text("description"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
    createdBy: text("created_by").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "workspace_company_id_company_id_fk",
    }).onDelete("cascade"),
  ],
);
