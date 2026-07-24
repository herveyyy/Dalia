import { employee, employeeEmergencyContact, employeeDeduction, employeeAllowance } from "@repo/db";

export type EmployeeSelect = typeof employee.$inferSelect;
export type EmployeeInsert = typeof employee.$inferInsert;

export type EmergencyContactSelect = typeof employeeEmergencyContact.$inferSelect;
export type DeductionSelect = typeof employeeDeduction.$inferSelect;
export type AllowanceSelect = typeof employeeAllowance.$inferSelect;
