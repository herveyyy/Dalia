# Employee Record Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the database tables and Drizzle ORM relationships for the 3NF employee database schema in the `@repo/db` package.

**Architecture:** We will create a new schema group/namespace `employee` under `packages/db/src/schema/employee` with separate `tables.ts` and `relations.ts` files, update the main schema exports, and expand company relations to reference employee schema entities.

**Tech Stack:** Drizzle ORM, Bun, PostgreSQL.

## Global Constraints

- Maintain Third Normal Form (3NF) across all table mappings.
- Follow existing patterns in `packages/db/src/schema/` for naming columns and types.
- Ensure all references are properly typed and typed checked with `tsc --noEmit`.

---

### Task 1: Create Employee Tables

**Files:**
- Create: [packages/db/src/schema/employee/tables.ts](file:///c:/Users/hmapa/Documents/PROJECTS/dalia/packages/db/src/schema/employee/tables.ts)

**Interfaces:**
- Produces: `employee`, `employeeEmergencyContact`, `deductionType`, `employeeDeduction`, `allowanceType`, `employeeAllowance` table definitions.

- [ ] **Step 1: Write table schema definitions**

Create file `packages/db/src/schema/employee/tables.ts` with the following content:

```typescript
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
```

- [ ] **Step 2: Commit Task 1**

```bash
git add packages/db/src/schema/employee/tables.ts
git commit -m "feat: add employee and 3NF payroll tables"
```

---

### Task 2: Implement Employee Relations

**Files:**
- Create: [packages/db/src/schema/employee/relations.ts](file:///c:/Users/hmapa/Documents/PROJECTS/dalia/packages/db/src/schema/employee/relations.ts)

**Interfaces:**
- Consumes: `employee`, `employeeEmergencyContact`, `deductionType`, `employeeDeduction`, `allowanceType`, `employeeAllowance` from `./tables`
- Produces: Relations mapping for all employee-related tables.

- [ ] **Step 1: Write employee relations definition**

Create file `packages/db/src/schema/employee/relations.ts` with the following content:

```typescript
import { relations } from "drizzle-orm/relations";
import { company } from "../firm/tables";
import {
  employee,
  employeeEmergencyContact,
  deductionType,
  employeeDeduction,
  allowanceType,
  employeeAllowance,
} from "./tables";

export const employeeRelations = relations(employee, ({ one, many }) => ({
  company: one(company, {
    fields: [employee.companyId],
    references: [company.id],
  }),
  supervisor: one(employee, {
    fields: [employee.supervisorId],
    references: [employee.id],
    relationName: "employee_supervisor",
  }),
  subordinates: many(employee, {
    relationName: "employee_supervisor",
  }),
  emergencyContacts: many(employeeEmergencyContact),
  deductions: many(employeeDeduction),
  allowances: many(employeeAllowance),
}));

export const employeeEmergencyContactRelations = relations(
  employeeEmergencyContact,
  ({ one }) => ({
    employee: one(employee, {
      fields: [employeeEmergencyContact.employeeId],
      references: [employee.id],
    }),
  })
);

export const deductionTypeRelations = relations(deductionType, ({ one, many }) => ({
  company: one(company, {
    fields: [deductionType.companyId],
    references: [company.id],
  }),
  employeeDeductions: many(employeeDeduction),
}));

export const employeeDeductionRelations = relations(employeeDeduction, ({ one }) => ({
  employee: one(employee, {
    fields: [employeeDeduction.employeeId],
    references: [employee.id],
  }),
  deductionType: one(deductionType, {
    fields: [employeeDeduction.deductionTypeId],
    references: [deductionType.id],
  }),
}));

export const allowanceTypeRelations = relations(allowanceType, ({ one, many }) => ({
  company: one(company, {
    fields: [allowanceType.companyId],
    references: [company.id],
  }),
  employeeAllowances: many(employeeAllowance),
}));

export const employeeAllowanceRelations = relations(employeeAllowance, ({ one }) => ({
  employee: one(employee, {
    fields: [employeeAllowance.employeeId],
    references: [employee.id],
  }),
  allowanceType: one(allowanceType, {
    fields: [employeeAllowance.allowanceTypeId],
    references: [allowanceType.id],
  }),
}));
```

- [ ] **Step 2: Commit Task 2**

```bash
git add packages/db/src/schema/employee/relations.ts
git commit -m "feat: add relations for employee schema tables"
```

---

### Task 3: Update Existing Schemas and Main Exports

**Files:**
- Modify: [packages/db/src/schema/firm/relations.ts](file:///c:/Users/hmapa/Documents/PROJECTS/dalia/packages/db/src/schema/firm/relations.ts)
- Modify: [packages/db/src/schema/index.ts](file:///c:/Users/hmapa/Documents/PROJECTS/dalia/packages/db/src/schema/index.ts)

**Interfaces:**
- Consumes: Tables and relations from `employee`
- Produces: Unified schema index exporting all new entities, and updated `companyRelations`.

- [ ] **Step 1: Update Company Relations**

In `packages/db/src/schema/firm/relations.ts`, import `employee`, `deductionType`, and `allowanceType`, and modify `companyRelations` to expose the many-relations:

```typescript
import { relations } from "drizzle-orm/relations";
import { user } from "../auth/tables";
import { company, workspace } from "./tables";
import { employee, deductionType, allowanceType } from "../employee/tables";

export const companyRelations = relations(company, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [company.createdBy],
    references: [user.id],
  }),
  employees: many(employee),
  deductionTypes: many(deductionType),
  allowanceTypes: many(allowanceType),
}));

export const workspaceRelations = relations(workspace, ({ one }) => ({
  createdByUser: one(user, {
    fields: [workspace.createdBy],
    references: [user.id],
  }),
}));

export const userCompanyRelations = relations(user, ({ one }) => ({
  company: one(company, {
    fields: [user.companyId],
    references: [company.id],
  }),
}));
```

- [ ] **Step 2: Export new tables from Root Schema**

Append exports in `packages/db/src/schema/index.ts`:

```typescript
export * from "./auth/tables";
export * from "./auth/relations";
export * from "./firm/tables";
export * from "./firm/relations";
export * from "./employee/tables";
export * from "./employee/relations";
```

- [ ] **Step 3: Commit Task 3**

```bash
git add packages/db/src/schema/firm/relations.ts packages/db/src/schema/index.ts
git commit -m "feat: export employee schema and add company relations"
```

---

### Task 4: Verify and Generate Migrations

**Files:**
- None (verify via terminal commands)

- [ ] **Step 1: Check Types**

Run `bun run check-types` in the workspace to verify there are no TypeScript compile-time errors in the monorepo.
Expected: Process exits with code 0.

- [ ] **Step 2: Generate Drizzle Migrations**

Run `bun run db:generate` in the workspace to generate the migrations files under `packages/db/drizzle`.
Expected: Successfully generates the SQL migration file.

- [ ] **Step 3: Commit Migration Files**

```bash
git add packages/db/drizzle
git commit -m "feat: generate migrations for employee schema"
```
