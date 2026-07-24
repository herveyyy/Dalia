-- Convert app table PKs/FKs to uuid with gen_random_uuid() defaults.
-- Auth tables (user/session/account/verification) stay text for Better Auth.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint

-- Clear dependent app data that may use non-uuid text ids (emp_*, job_*, etc.)
TRUNCATE TABLE
  "user_role",
  "role",
  "employee_allowance",
  "employee_deduction",
  "employee_emergency_contact",
  "employee",
  "job_posting",
  "deduction_type",
  "allowance_type",
  "tax_type",
  "department"
CASCADE;
--> statement-breakpoint

ALTER TABLE "role" DROP CONSTRAINT IF EXISTS "role_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "user_role" DROP CONSTRAINT IF EXISTS "user_role_role_id_role_id_fk";
--> statement-breakpoint
ALTER TABLE "employee" DROP CONSTRAINT IF EXISTS "employee_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "employee" DROP CONSTRAINT IF EXISTS "employee_department_id_department_id_fk";
--> statement-breakpoint
ALTER TABLE "employee" DROP CONSTRAINT IF EXISTS "employee_supervisor_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "employee" DROP CONSTRAINT IF EXISTS "employee_tax_type_id_tax_type_id_fk";
--> statement-breakpoint
ALTER TABLE "employee_emergency_contact" DROP CONSTRAINT IF EXISTS "emergency_contact_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "deduction_type" DROP CONSTRAINT IF EXISTS "deduction_type_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "employee_deduction" DROP CONSTRAINT IF EXISTS "employee_deduction_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "employee_deduction" DROP CONSTRAINT IF EXISTS "employee_deduction_deduction_type_id_deduction_type_id_fk";
--> statement-breakpoint
ALTER TABLE "allowance_type" DROP CONSTRAINT IF EXISTS "allowance_type_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "employee_allowance" DROP CONSTRAINT IF EXISTS "employee_allowance_employee_id_employee_id_fk";
--> statement-breakpoint
ALTER TABLE "employee_allowance" DROP CONSTRAINT IF EXISTS "employee_allowance_allowance_type_id_allowance_type_id_fk";
--> statement-breakpoint
ALTER TABLE "tax_type" DROP CONSTRAINT IF EXISTS "tax_type_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "department" DROP CONSTRAINT IF EXISTS "department_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "job_posting" DROP CONSTRAINT IF EXISTS "job_posting_company_id_company_id_fk";
--> statement-breakpoint
ALTER TABLE "job_posting" DROP CONSTRAINT IF EXISTS "job_posting_department_id_department_id_fk";
--> statement-breakpoint

-- company
ALTER TABLE "company" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "company" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "company" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint

-- workspace (integer → uuid)
ALTER TABLE "workspace" ADD COLUMN "id_uuid" uuid DEFAULT gen_random_uuid() NOT NULL;
--> statement-breakpoint
ALTER TABLE "workspace" DROP CONSTRAINT "workspace_pkey";
--> statement-breakpoint
ALTER TABLE "workspace" DROP COLUMN "id";
--> statement-breakpoint
ALTER TABLE "workspace" RENAME COLUMN "id_uuid" TO "id";
--> statement-breakpoint
ALTER TABLE "workspace" ADD PRIMARY KEY ("id");
--> statement-breakpoint

-- role / user_role
ALTER TABLE "role" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint
ALTER TABLE "user_role" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "user_role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "user_role" ALTER COLUMN "role_id" TYPE uuid USING "role_id"::uuid;
--> statement-breakpoint

-- employee domain
ALTER TABLE "department" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "department" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "department" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint

ALTER TABLE "tax_type" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "tax_type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "tax_type" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint

ALTER TABLE "deduction_type" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "deduction_type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "deduction_type" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint

ALTER TABLE "allowance_type" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "allowance_type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "allowance_type" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint

ALTER TABLE "job_posting" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "department_id" TYPE uuid USING "department_id"::uuid;
--> statement-breakpoint

ALTER TABLE "employee" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "company_id" TYPE uuid USING "company_id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "department_id" TYPE uuid USING "department_id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "supervisor_id" TYPE uuid USING "supervisor_id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee" ALTER COLUMN "tax_type_id" TYPE uuid USING "tax_type_id"::uuid;
--> statement-breakpoint

ALTER TABLE "employee_emergency_contact" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee_emergency_contact" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "employee_emergency_contact" ALTER COLUMN "employee_id" TYPE uuid USING "employee_id"::uuid;
--> statement-breakpoint

ALTER TABLE "employee_deduction" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee_deduction" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "employee_deduction" ALTER COLUMN "employee_id" TYPE uuid USING "employee_id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee_deduction" ALTER COLUMN "deduction_type_id" TYPE uuid USING "deduction_type_id"::uuid;
--> statement-breakpoint

ALTER TABLE "employee_allowance" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee_allowance" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "employee_allowance" ALTER COLUMN "employee_id" TYPE uuid USING "employee_id"::uuid;
--> statement-breakpoint
ALTER TABLE "employee_allowance" ALTER COLUMN "allowance_type_id" TYPE uuid USING "allowance_type_id"::uuid;
--> statement-breakpoint

ALTER TABLE "role" ADD CONSTRAINT "role_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_supervisor_id_employee_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."employee"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_tax_type_id_tax_type_id_fk" FOREIGN KEY ("tax_type_id") REFERENCES "public"."tax_type"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_emergency_contact" ADD CONSTRAINT "emergency_contact_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "deduction_type" ADD CONSTRAINT "deduction_type_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_deduction" ADD CONSTRAINT "employee_deduction_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_deduction" ADD CONSTRAINT "employee_deduction_deduction_type_id_deduction_type_id_fk" FOREIGN KEY ("deduction_type_id") REFERENCES "public"."deduction_type"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "allowance_type" ADD CONSTRAINT "allowance_type_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_allowance" ADD CONSTRAINT "employee_allowance_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "employee_allowance" ADD CONSTRAINT "employee_allowance_allowance_type_id_allowance_type_id_fk" FOREIGN KEY ("allowance_type_id") REFERENCES "public"."allowance_type"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tax_type" ADD CONSTRAINT "tax_type_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "department" ADD CONSTRAINT "department_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "job_posting" ADD CONSTRAINT "job_posting_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "job_posting" ADD CONSTRAINT "job_posting_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE set null ON UPDATE no action;
