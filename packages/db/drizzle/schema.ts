import { pgTable, foreignKey, text, timestamp, uuid, unique, integer, boolean, numeric, index, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const workspace = pgTable("workspace", {
	name: text().notNull(),
	websiteUrl: text("website_url"),
	headquarters: text(),
	description: text(),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: text("created_by").notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	adminEmail: text("admin_email"),
	businessType: text("business_type"),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "workspace_company_id_company_id_fk"
		}).onDelete("cascade"),
]);

export const appModule = pgTable("app_module", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	key: text().notNull(),
	name: text().notNull(),
	description: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("app_module_key_unique").on(table.key),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const appFeature = pgTable("app_feature", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	appModuleId: uuid("app_module_id").notNull(),
	key: text().notNull(),
	name: text().notNull(),
	description: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appModuleId],
			foreignColumns: [appModule.id],
			name: "app_feature_app_module_id_app_module_id_fk"
		}).onDelete("cascade"),
	unique("app_feature_app_module_id_key_unique").on(table.key, table.appModuleId),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const department = pgTable("department", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	name: text().notNull(),
	description: text(),
	isArchived: boolean("is_archived").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "department_company_id_company_id_fk"
		}).onDelete("cascade"),
]);

export const role = pgTable("role", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	name: text().notNull(),
	description: text(),
	isSystem: boolean("is_system").default(false).notNull(),
	createdBy: text("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [user.id],
			name: "role_created_by_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "role_company_id_company_id_fk"
		}).onDelete("cascade"),
	unique("role_company_id_name_unique").on(table.name, table.companyId),
]);

export const userRole = pgTable("user_role", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	roleId: uuid("role_id").notNull(),
	assignedBy: text("assigned_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_role_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [user.id],
			name: "user_role_assigned_by_user_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "user_role_role_id_role_id_fk"
		}).onDelete("cascade"),
	unique("user_role_user_id_role_id_unique").on(table.userId, table.roleId),
]);

export const company = pgTable("company", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	websiteUrl: text("website_url"),
	headquarters: text(),
	description: text(),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: text("created_by").notNull(),
	businessType: text("business_type"),
});

export const employee = pgTable("employee", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeNo: text("employee_no"),
	firstName: text("first_name").notNull(),
	middleName: text("middle_name"),
	lastName: text("last_name").notNull(),
	suffix: text(),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	gender: text(),
	personalEmail: text("personal_email"),
	workEmail: text("work_email"),
	phoneNumber: text("phone_number"),
	residentialAddress: text("residential_address"),
	tin: text(),
	philhealth: text(),
	pagIbig: text("pag_ibig"),
	sssNo: text("sss_no"),
	philIdNo: text("phil_id_no"),
	companyId: uuid("company_id").notNull(),
	departmentId: uuid("department_id"),
	jobTitle: text("job_title"),
	responsibilityCenter: text("responsibility_center"),
	employmentStatus: text("employment_status").default('Active').notNull(),
	employmentSchedule: text("employment_schedule"),
	supervisorId: uuid("supervisor_id"),
	dateOfHire: timestamp("date_of_hire", { mode: 'string' }),
	payType: text("pay_type"),
	basePayRate: numeric("base_pay_rate", { precision: 12, scale:  2 }).default('0.00').notNull(),
	payFrequency: text("pay_frequency").default('Semi-monthly').notNull(),
	bankName: text("bank_name"),
	bankAccountNumber: text("bank_account_number"),
	brstnBankCode: text("brstn_bank_code"),
	totalRegularHours: numeric("total_regular_hours", { precision: 8, scale:  2 }).default('0.00').notNull(),
	overtimeHours: numeric("overtime_hours", { precision: 8, scale:  2 }).default('0.00').notNull(),
	leaveBalanceDays: numeric("leave_balance_days", { precision: 5, scale:  2 }).default('0.00').notNull(),
	taxBracketCode: text("tax_bracket_code"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	taxTypeId: uuid("tax_type_id"),
	roleId: uuid("role_id"),
	userId: text("user_id"),
	branchId: uuid("branch_id"),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "employee_role_id_role_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branch.id],
			name: "employee_branch_id_branch_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "employee_user_id_user_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "employee_company_id_company_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [department.id],
			name: "employee_department_id_department_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.supervisorId],
			foreignColumns: [table.id],
			name: "employee_supervisor_id_employee_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.taxTypeId],
			foreignColumns: [taxType.id],
			name: "employee_tax_type_id_tax_type_id_fk"
		}).onDelete("set null"),
	unique("employee_user_id_unique").on(table.userId),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	companyId: text("company_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const allowanceType = pgTable("allowance_type", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	name: text().notNull(),
	isTaxable: boolean("is_taxable").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "allowance_type_company_id_company_id_fk"
		}).onDelete("cascade"),
]);

export const deductionType = pgTable("deduction_type", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	name: text().notNull(),
	category: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "deduction_type_company_id_company_id_fk"
		}).onDelete("cascade"),
]);

export const jobPosting = pgTable("job_posting", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	title: text().notNull(),
	departmentId: uuid("department_id"),
	location: text(),
	employmentType: text("employment_type").notNull(),
	description: text().notNull(),
	requirements: text(),
	salaryRange: text("salary_range"),
	status: text().default('Published').notNull(),
	isArchived: boolean("is_archived").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "job_posting_company_id_company_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [department.id],
			name: "job_posting_department_id_department_id_fk"
		}).onDelete("set null"),
]);

export const taxType = pgTable("tax_type", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	name: text().notNull(),
	rate: numeric({ precision: 5, scale:  2 }).default('0.00').notNull(),
	description: text(),
	isArchived: boolean("is_archived").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "tax_type_company_id_company_id_fk"
		}).onDelete("cascade"),
]);

export const rolePermission = pgTable("role_permission", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roleId: uuid("role_id").notNull(),
	featureId: uuid("feature_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [role.id],
			name: "role_permission_role_id_role_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.featureId],
			foreignColumns: [appFeature.id],
			name: "role_permission_feature_id_app_feature_id_fk"
		}).onDelete("cascade"),
	unique("role_permission_role_id_feature_id_unique").on(table.roleId, table.featureId),
]);

export const employeeAllowance = pgTable("employee_allowance", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	allowanceTypeId: uuid("allowance_type_id").notNull(),
	amount: numeric({ precision: 12, scale:  2 }).default('0.00').notNull(),
	frequency: text().default('monthly').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employee.id],
			name: "employee_allowance_employee_id_employee_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.allowanceTypeId],
			foreignColumns: [allowanceType.id],
			name: "employee_allowance_allowance_type_id_allowance_type_id_fk"
		}).onDelete("cascade"),
]);

export const employeeDeduction = pgTable("employee_deduction", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	deductionTypeId: uuid("deduction_type_id").notNull(),
	amount: numeric({ precision: 12, scale:  2 }).default('0.00').notNull(),
	frequency: text().default('every_pay_period').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employee.id],
			name: "employee_deduction_employee_id_employee_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.deductionTypeId],
			foreignColumns: [deductionType.id],
			name: "employee_deduction_deduction_type_id_deduction_type_id_fk"
		}).onDelete("cascade"),
]);

export const employeeEmergencyContact = pgTable("employee_emergency_contact", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	contactPerson: text("contact_person").notNull(),
	contactNo: text("contact_no").notNull(),
	contactAddress: text("contact_address"),
	relationship: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employee.id],
			name: "emergency_contact_employee_id_employee_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const branch = pgTable("branch", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	name: text().notNull(),
	code: text(),
	address: text(),
	description: text(),
	isArchived: boolean("is_archived").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "branch_company_id_company_id_fk"
		}).onDelete("cascade"),
]);

export const activityLog = pgTable("activity_log", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id"),
	actorId: text("actor_id"),
	actorName: text("actor_name"),
	actorEmail: text("actor_email"),
	entityType: text("entity_type").notNull(),
	entityId: text("entity_id").notNull(),
	action: text().notNull(),
	summary: text(),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data"),
	changes: jsonb(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("activity_log_action_idx").using("btree", table.action.asc().nullsLast().op("text_ops")),
	index("activity_log_actor_id_idx").using("btree", table.actorId.asc().nullsLast().op("text_ops")),
	index("activity_log_company_id_idx").using("btree", table.companyId.asc().nullsLast().op("uuid_ops")),
	index("activity_log_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("activity_log_entity_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "activity_log_company_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [user.id],
			name: "activity_log_actor_id_fk"
		}).onDelete("set null"),
]);
