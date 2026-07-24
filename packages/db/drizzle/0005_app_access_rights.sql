CREATE TABLE IF NOT EXISTS "app_module" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_module_key_unique" UNIQUE("key")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "app_feature" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_module_id" uuid NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_feature_app_module_id_key_unique" UNIQUE("app_module_id","key")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "role_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "role_permission_role_id_feature_id_unique" UNIQUE("role_id","feature_id")
);
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "app_feature"
    ADD CONSTRAINT "app_feature_app_module_id_app_module_id_fk"
    FOREIGN KEY ("app_module_id") REFERENCES "public"."app_module"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "role_permission"
    ADD CONSTRAINT "role_permission_role_id_role_id_fk"
    FOREIGN KEY ("role_id") REFERENCES "public"."role"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "role_permission"
    ADD CONSTRAINT "role_permission_feature_id_app_feature_id_fk"
    FOREIGN KEY ("feature_id") REFERENCES "public"."app_feature"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
