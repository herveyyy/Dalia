-- Each client workspace gets a matching company row (same id) for tenant-scoped HR data.
INSERT INTO "company" ("id", "name", "website_url", "headquarters", "description", "logo_url", "created_at", "updated_at", "created_by")
SELECT w."id", w."name", w."website_url", w."headquarters", w."description", w."logo_url", w."created_at", w."updated_at", w."created_by"
FROM "workspace" w
WHERE NOT EXISTS (SELECT 1 FROM "company" c WHERE c."id" = w."id");
--> statement-breakpoint

ALTER TABLE "employee" ADD COLUMN IF NOT EXISTS "role_id" uuid;
--> statement-breakpoint

ALTER TABLE "employee" DROP CONSTRAINT IF EXISTS "employee_role_id_role_id_fk";
--> statement-breakpoint

ALTER TABLE "employee"
  ADD CONSTRAINT "employee_role_id_role_id_fk"
  FOREIGN KEY ("role_id") REFERENCES "public"."role"("id")
  ON DELETE set null ON UPDATE no action;
