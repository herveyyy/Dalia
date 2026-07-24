-- Link each client workspace to the owning firm company.
ALTER TABLE "workspace" ADD COLUMN "company_id" uuid;
--> statement-breakpoint

-- Backfill from creator's company when possible
UPDATE "workspace" w
SET "company_id" = u."company_id"::uuid
FROM "user" u
WHERE w."created_by" = u."id"
  AND u."company_id" IS NOT NULL
  AND u."company_id" ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
--> statement-breakpoint

-- Drop orphan workspaces that cannot be linked to a company
DELETE FROM "workspace" WHERE "company_id" IS NULL;
--> statement-breakpoint

ALTER TABLE "workspace" ALTER COLUMN "company_id" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "workspace"
  ADD CONSTRAINT "workspace_company_id_company_id_fk"
  FOREIGN KEY ("company_id") REFERENCES "public"."company"("id")
  ON DELETE cascade ON UPDATE no action;
