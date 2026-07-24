import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  foreignKey,
  uuid,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "../auth/tables";
import { company } from "../firm/tables";
import { role } from "../rbac/tables";

export const employee = pgTable(
  "employee",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    employeeNo: text("employee_no"),
    firstName: text("first_name").notNull(),
    middleName: text("middle_name"),
    lastName: text("last_name").notNull(),
    suffix: text("suffix"),
    dateOfBirth: timestamp("date_of_birth", { mode: "string" }),
    gender: text("gender"),
    personalEmail: text("personal_email"),
    workEmail: text("work_email"),
    phoneNumber: text("phone_number"),
    residentialAddress: text("residential_address"),
    tin: text("tin"),
    philhealth: text("philhealth"),
    pagIbig: text("pag_ibig"),
    sssNo: text("sss_no"),
    philIdNo: text("phil_id_no"),

    companyId: uuid("company_id").notNull(),
    userId: text("user_id"),
    departmentId: uuid("department_id"),
    roleId: uuid("role_id"),
    jobTitle: text("job_title"),
    responsibilityCenter: text("responsibility_center"),
    employmentStatus: text("employment_status").default("Active").notNull(),
    employmentSchedule: text("employment_schedule"),
    supervisorId: uuid("supervisor_id"),
    dateOfHire: timestamp("date_of_hire", { mode: "string" }),

    payType: text("pay_type"),
    basePayRate: numeric("base_pay_rate", { precision: 12, scale: 2 }).default("0.00").notNull(),
    payFrequency: text("pay_frequency").default("Semi-monthly").notNull(),
    bankName: text("bank_name"),
    bankAccountNumber: text("bank_account_number"),
    brstnBankCode: text("brstn_bank_code"),

    totalRegularHours: numeric("total_regular_hours", { precision: 8, scale: 2 }).default("0.00").notNull(),
    overtimeHours: numeric("overtime_hours", { precision: 8, scale: 2 }).default("0.00").notNull(),
    leaveBalanceDays: numeric("leave_balance_days", { precision: 5, scale: 2 }).default("0.00").notNull(),
    taxBracketCode: text("tax_bracket_code"),
    taxTypeId: uuid("tax_type_id"),

    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "employee_company_id_company_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "employee_user_id_user_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.departmentId],
      foreignColumns: [department.id],
      name: "employee_department_id_department_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [role.id],
      name: "employee_role_id_role_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.supervisorId],
      foreignColumns: [table.id],
      name: "employee_supervisor_id_employee_id_fk",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.taxTypeId],
      foreignColumns: [taxType.id],
      name: "employee_tax_type_id_tax_type_id_fk",
    }).onDelete("set null"),
    unique("employee_user_id_unique").on(table.userId),
  ]
);

export const employeeEmergencyContact = pgTable(
  "employee_emergency_contact",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    employeeId: uuid("employee_id").notNull(),
    contactPerson: text("contact_person").notNull(),
    contactNo: text("contact_no").notNull(),
    contactAddress: text("contact_address"),
    relationship: text("relationship").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employee.id],
      name: "emergency_contact_employee_id_employee_id_fk",
    }).onDelete("cascade"),
  ]
);

export const deductionType = pgTable(
  "deduction_type",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "deduction_type_company_id_company_id_fk",
    }).onDelete("cascade"),
  ]
);

export const employeeDeduction = pgTable(
  "employee_deduction",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    employeeId: uuid("employee_id").notNull(),
    deductionTypeId: uuid("deduction_type_id").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
    frequency: text("frequency").default("every_pay_period").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employee.id],
      name: "employee_deduction_employee_id_employee_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.deductionTypeId],
      foreignColumns: [deductionType.id],
      name: "employee_deduction_deduction_type_id_deduction_type_id_fk",
    }).onDelete("cascade"),
  ]
);

export const allowanceType = pgTable(
  "allowance_type",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    isTaxable: boolean("is_taxable").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "allowance_type_company_id_company_id_fk",
    }).onDelete("cascade"),
  ]
);

export const employeeAllowance = pgTable(
  "employee_allowance",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    employeeId: uuid("employee_id").notNull(),
    allowanceTypeId: uuid("allowance_type_id").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
    frequency: text("frequency").default("monthly").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employee.id],
      name: "employee_allowance_employee_id_employee_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.allowanceTypeId],
      foreignColumns: [allowanceType.id],
      name: "employee_allowance_allowance_type_id_allowance_type_id_fk",
    }).onDelete("cascade"),
  ]
);

export const taxType = pgTable(
  "tax_type",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    rate: numeric("rate", { precision: 5, scale: 2 }).default("0.00").notNull(),
    description: text("description"),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "tax_type_company_id_company_id_fk",
    }).onDelete("cascade"),
  ]
);

export const department = pgTable(
  "department",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "department_company_id_company_id_fk",
    }).onDelete("cascade"),
  ]
);

export const jobPosting = pgTable(
  "job_posting",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    companyId: uuid("company_id").notNull(),
    title: text("title").notNull(),
    departmentId: uuid("department_id"),
    location: text("location"),
    employmentType: text("employment_type").notNull(),
    description: text("description").notNull(),
    requirements: text("requirements"),
    salaryRange: text("salary_range"),
    status: text("status").default("Published").notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
      name: "job_posting_company_id_company_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.departmentId],
      foreignColumns: [department.id],
      name: "job_posting_department_id_department_id_fk",
    }).onDelete("set null"),
  ]
);
