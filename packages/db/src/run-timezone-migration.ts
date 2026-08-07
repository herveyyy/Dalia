import { db, sql } from "./index";
import "dotenv/config";

async function main() {
  console.log("Running manual timestamp to timestamptz conversion migration...");

  const queries = [
    `ALTER TABLE "activity_log" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "activity_log" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "account" ALTER COLUMN "access_token_expires_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "account" ALTER COLUMN "refresh_token_expires_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "account" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "session" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "session" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "verification" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "verification" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "allowance_type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "allowance_type" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "allowance_type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "allowance_type" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "branch" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "branch" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "branch" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "branch" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "deduction_type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "deduction_type" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "deduction_type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "deduction_type" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "department" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "department" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "department" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "department" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "employee" ALTER COLUMN "date_of_birth" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee" ALTER COLUMN "date_of_hire" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "employee" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "employee_allowance" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee_allowance" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "employee_allowance" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee_allowance" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "employee_deduction" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee_deduction" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "employee_deduction" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee_deduction" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "employee_emergency_contact" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee_emergency_contact" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "employee_emergency_contact" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "employee_emergency_contact" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "job_posting" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "job_posting" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "job_posting" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "job_posting" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "tax_type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "tax_type" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "tax_type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "tax_type" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "company" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "company" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "company" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "company" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "workspace" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "workspace" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "workspace" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "workspace" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "app_feature" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "app_feature" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "app_feature" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "app_feature" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "app_module" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "app_module" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "app_module" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "app_module" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "role" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "role" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT now();`,
    `ALTER TABLE "role_permission" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "role_permission" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "user_role" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "user_role" ALTER COLUMN "created_at" SET DEFAULT now();`,
    `ALTER TABLE "user_role" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;`,
    `ALTER TABLE "user_role" ALTER COLUMN "updated_at" SET DEFAULT now();`
  ];

  for (const query of queries) {
    try {
      await db.execute(sql.raw(query));
      console.log(`Executed: ${query.substring(0, 60)}...`);
    } catch (err: any) {
      console.error(`Failed to execute: ${query}\nError: ${err.message}`);
    }
  }

  console.log("Timezone migration complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
