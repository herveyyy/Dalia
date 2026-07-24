CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"company_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allowance_type" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"is_taxable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deduction_type" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_no" text,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"suffix" text,
	"date_of_birth" timestamp,
	"gender" text,
	"personal_email" text,
	"work_email" text,
	"phone_number" text,
	"residential_address" text,
	"tin" text,
	"philhealth" text,
	"pag_ibig" text,
	"sss_no" text,
	"phil_id_no" text,
	"company_id" text NOT NULL,
	"department" text,
	"job_title" text,
	"responsibility_center" text,
	"employment_status" text DEFAULT 'Active' NOT NULL,
	"employment_schedule" text,
	"supervisor_id" text,
	"date_of_hire" timestamp,
	"pay_type" text,
	"base_pay_rate" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"pay_frequency" text DEFAULT 'Semi-monthly' NOT NULL,
	"bank_name" text,
	"bank_account_number" text,
	"brstn_bank_code" text,
	"total_regular_hours" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"overtime_hours" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"leave_balance_days" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"tax_bracket_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_allowance" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"allowance_type_id" text NOT NULL,
	"amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"frequency" text DEFAULT 'monthly' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_deduction" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"deduction_type_id" text NOT NULL,
	"amount" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"frequency" text DEFAULT 'every_pay_period' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_emergency_contact" (
	"id" text PRIMARY KEY NOT NULL,
	"employee_id" text NOT NULL,
	"contact_person" text NOT NULL,
	"contact_no" text NOT NULL,
	"contact_address" text,
	"relationship" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website_url" text,
	"headquarters" text,
	"description" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website_url" text,
	"headquarters" text,
	"description" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allowance_type" ADD CONSTRAINT "allowance_type_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deduction_type" ADD CONSTRAINT "deduction_type_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_supervisor_id_employee_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."employee"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_allowance" ADD CONSTRAINT "employee_allowance_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_allowance" ADD CONSTRAINT "employee_allowance_allowance_type_id_allowance_type_id_fk" FOREIGN KEY ("allowance_type_id") REFERENCES "public"."allowance_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_deduction" ADD CONSTRAINT "employee_deduction_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_deduction" ADD CONSTRAINT "employee_deduction_deduction_type_id_deduction_type_id_fk" FOREIGN KEY ("deduction_type_id") REFERENCES "public"."deduction_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_emergency_contact" ADD CONSTRAINT "emergency_contact_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;