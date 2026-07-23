import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const company = pgTable('company', {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    websiteUrl: text("website_url"),
    headquarters: text("headquarters"),
    description: text("description"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
    createdBy: text('created_by').notNull()
});

export const workspace = pgTable('workspace', {
    id: integer("id").primaryKey().notNull(),
    name: text("name").notNull(),
    websiteUrl: text("website_url"),
    headquarters: text("headquarters"),
    description: text("description"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
    createdBy: text('created_by').notNull()
});