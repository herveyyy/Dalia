import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  foreignKey,
} from "drizzle-orm/pg-core";
import { company } from "../firm/tables";

export const employee = pgTable(
  "employee",
  {
    id: text("id").primaryKey().notNull(),
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

    companyId: text("company_id").notNull(),
    department: text("department"),
    jobTitle: text("job_title"),
    responsibilityCenter: text("responsibility_center"),
    employmentStatus: text("employment_status").default("Active").notNull(),
    employmentSchedule: text("employment_schedule"),
    supervisorId: text("supervisor_id"),
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
      columns: [table.supervisorId],
      foreignColumns: [table.id],
      name: "employee_supervisor_id_employee_id_fk",
    }).onDelete("set null"),
  ]
);

export const employeeEmergencyContact = pgTable(
  "employee_emergency_contact",
  {
    id: text("id").primaryKey().notNull(),
    employeeId: text("employee_id").notNull(),
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
    id: text("id").primaryKey().notNull(),
    companyId: text("company_id").notNull(),
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
    id: text("id").primaryKey().notNull(),
    employeeId: text("employee_id").notNull(),
    deductionTypeId: text("deduction_type_id").notNull(),
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
    id: text("id").primaryKey().notNull(),
    companyId: text("company_id").notNull(),
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
    id: text("id").primaryKey().notNull(),
    employeeId: text("employee_id").notNull(),
    allowanceTypeId: text("allowance_type_id").notNull(),
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
