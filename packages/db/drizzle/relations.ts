import { relations } from "drizzle-orm/relations";
import { company, workspace, appModule, appFeature, user, account, department, role, userRole, employee, branch, taxType, allowanceType, deductionType, jobPosting, rolePermission, employeeAllowance, employeeDeduction, employeeEmergencyContact, session, activityLog } from "./schema";

export const workspaceRelations = relations(workspace, ({one}) => ({
	company: one(company, {
		fields: [workspace.companyId],
		references: [company.id]
	}),
}));

export const companyRelations = relations(company, ({many}) => ({
	workspaces: many(workspace),
	departments: many(department),
	roles: many(role),
	employees: many(employee),
	allowanceTypes: many(allowanceType),
	deductionTypes: many(deductionType),
	jobPostings: many(jobPosting),
	taxTypes: many(taxType),
	branches: many(branch),
	activityLogs: many(activityLog),
}));

export const appFeatureRelations = relations(appFeature, ({one, many}) => ({
	appModule: one(appModule, {
		fields: [appFeature.appModuleId],
		references: [appModule.id]
	}),
	rolePermissions: many(rolePermission),
}));

export const appModuleRelations = relations(appModule, ({many}) => ({
	appFeatures: many(appFeature),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	roles: many(role),
	userRoles_userId: many(userRole, {
		relationName: "userRole_userId_user_id"
	}),
	userRoles_assignedBy: many(userRole, {
		relationName: "userRole_assignedBy_user_id"
	}),
	employees: many(employee),
	sessions: many(session),
	activityLogs: many(activityLog),
}));

export const departmentRelations = relations(department, ({one, many}) => ({
	company: one(company, {
		fields: [department.companyId],
		references: [company.id]
	}),
	employees: many(employee),
	jobPostings: many(jobPosting),
}));

export const roleRelations = relations(role, ({one, many}) => ({
	user: one(user, {
		fields: [role.createdBy],
		references: [user.id]
	}),
	company: one(company, {
		fields: [role.companyId],
		references: [company.id]
	}),
	userRoles: many(userRole),
	employees: many(employee),
	rolePermissions: many(rolePermission),
}));

export const userRoleRelations = relations(userRole, ({one}) => ({
	user_userId: one(user, {
		fields: [userRole.userId],
		references: [user.id],
		relationName: "userRole_userId_user_id"
	}),
	user_assignedBy: one(user, {
		fields: [userRole.assignedBy],
		references: [user.id],
		relationName: "userRole_assignedBy_user_id"
	}),
	role: one(role, {
		fields: [userRole.roleId],
		references: [role.id]
	}),
}));

export const employeeRelations = relations(employee, ({one, many}) => ({
	role: one(role, {
		fields: [employee.roleId],
		references: [role.id]
	}),
	branch: one(branch, {
		fields: [employee.branchId],
		references: [branch.id]
	}),
	user: one(user, {
		fields: [employee.userId],
		references: [user.id]
	}),
	company: one(company, {
		fields: [employee.companyId],
		references: [company.id]
	}),
	department: one(department, {
		fields: [employee.departmentId],
		references: [department.id]
	}),
	employee: one(employee, {
		fields: [employee.supervisorId],
		references: [employee.id],
		relationName: "employee_supervisorId_employee_id"
	}),
	employees: many(employee, {
		relationName: "employee_supervisorId_employee_id"
	}),
	taxType: one(taxType, {
		fields: [employee.taxTypeId],
		references: [taxType.id]
	}),
	employeeAllowances: many(employeeAllowance),
	employeeDeductions: many(employeeDeduction),
	employeeEmergencyContacts: many(employeeEmergencyContact),
}));

export const branchRelations = relations(branch, ({one, many}) => ({
	employees: many(employee),
	company: one(company, {
		fields: [branch.companyId],
		references: [company.id]
	}),
}));

export const taxTypeRelations = relations(taxType, ({one, many}) => ({
	employees: many(employee),
	company: one(company, {
		fields: [taxType.companyId],
		references: [company.id]
	}),
}));

export const allowanceTypeRelations = relations(allowanceType, ({one, many}) => ({
	company: one(company, {
		fields: [allowanceType.companyId],
		references: [company.id]
	}),
	employeeAllowances: many(employeeAllowance),
}));

export const deductionTypeRelations = relations(deductionType, ({one, many}) => ({
	company: one(company, {
		fields: [deductionType.companyId],
		references: [company.id]
	}),
	employeeDeductions: many(employeeDeduction),
}));

export const jobPostingRelations = relations(jobPosting, ({one}) => ({
	company: one(company, {
		fields: [jobPosting.companyId],
		references: [company.id]
	}),
	department: one(department, {
		fields: [jobPosting.departmentId],
		references: [department.id]
	}),
}));

export const rolePermissionRelations = relations(rolePermission, ({one}) => ({
	role: one(role, {
		fields: [rolePermission.roleId],
		references: [role.id]
	}),
	appFeature: one(appFeature, {
		fields: [rolePermission.featureId],
		references: [appFeature.id]
	}),
}));

export const employeeAllowanceRelations = relations(employeeAllowance, ({one}) => ({
	employee: one(employee, {
		fields: [employeeAllowance.employeeId],
		references: [employee.id]
	}),
	allowanceType: one(allowanceType, {
		fields: [employeeAllowance.allowanceTypeId],
		references: [allowanceType.id]
	}),
}));

export const employeeDeductionRelations = relations(employeeDeduction, ({one}) => ({
	employee: one(employee, {
		fields: [employeeDeduction.employeeId],
		references: [employee.id]
	}),
	deductionType: one(deductionType, {
		fields: [employeeDeduction.deductionTypeId],
		references: [deductionType.id]
	}),
}));

export const employeeEmergencyContactRelations = relations(employeeEmergencyContact, ({one}) => ({
	employee: one(employee, {
		fields: [employeeEmergencyContact.employeeId],
		references: [employee.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const activityLogRelations = relations(activityLog, ({one}) => ({
	company: one(company, {
		fields: [activityLog.companyId],
		references: [company.id]
	}),
	user: one(user, {
		fields: [activityLog.actorId],
		references: [user.id]
	}),
}));