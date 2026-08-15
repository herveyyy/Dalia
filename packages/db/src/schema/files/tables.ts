import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const fileRecord = pgTable(
  "files",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    parentId: text("parent_id").notNull(),
    parentType: text("parent_type").notNull(),
    fileCategory: text("file_category").notNull(), // 'video', 'resume', 'cover_letter', 'avatar', 'document'
    fileName: text("file_name").notNull(),
    fileKey: text("file_key").notNull(),
    mimeType: text("mime_type"),
    fileSize: integer("file_size"),
    presignedUrl: text("presigned_url"),
    presignedUrlExpiresAt: timestamp("presigned_url_expires_at", {
      mode: "string",
      withTimezone: true,
    }),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("files_parent_id_idx").on(table.parentId),
    index("files_parent_type_idx").on(table.parentType),
    index("files_category_idx").on(table.fileCategory),
  ]
);

export type FileRecord = typeof fileRecord.$inferSelect;
export type NewFileRecord = typeof fileRecord.$inferInsert;
