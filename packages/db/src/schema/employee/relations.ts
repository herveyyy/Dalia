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
