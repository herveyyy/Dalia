ALTER TABLE "employee" ADD COLUMN IF NOT EXISTS "user_id" text;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "employee"
    ADD CONSTRAINT "employee_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
    ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "employee_user_id_unique"
  ON "employee" ("user_id")
  WHERE "user_id" IS NOT NULL;
