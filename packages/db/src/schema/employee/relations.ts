import { relations } from "drizzle-orm/relations";
import { user } from "../auth/tables";
import { company } from "../firm/tables";
import { role } from "../rbac/tables";
import {
  employee,
  employeeEmergencyContact,
  deductionType,
  employeeDeduction,
  allowanceType,
  employeeAllowance,
  taxType,
  jobPosting,
  department,
} from "./tables";

export const employeeRelations = relations(employee, ({ one, many }) => ({
  company: one(company, {
    fields: [employee.companyId],
    references: [company.id],
  }),
  loginUser: one(user, {
    fields: [employee.userId],
    references: [user.id],
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
  taxType: one(taxType, {
    fields: [employee.taxTypeId],
    references: [taxType.id],
  }),
  department: one(department, {
    fields: [employee.departmentId],
    references: [department.id],
  }),
  role: one(role, {
    fields: [employee.roleId],
    references: [role.id],
  }),
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

export const taxTypeRelations = relations(taxType, ({ one, many }) => ({
  company: one(company, {
    fields: [taxType.companyId],
    references: [company.id],
  }),
  employees: many(employee),
}));

export const jobPostingRelations = relations(jobPosting, ({ one }) => ({
  company: one(company, {
    fields: [jobPosting.companyId],
    references: [company.id],
  }),
  department: one(department, {
    fields: [jobPosting.departmentId],
    references: [department.id],
  }),
}));

export const departmentRelations = relations(department, ({ one, many }) => ({
  company: one(company, {
    fields: [department.companyId],
    references: [company.id],
  }),
  employees: many(employee),
  jobPostings: many(jobPosting),
}));
