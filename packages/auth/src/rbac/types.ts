import type { APP_ACCESS_CATALOG } from "@repo/db";

export type FeatureKey =
  // Firm Workspace
  | "workspace.dashboard.view"
  | "workspace.clients.manage"
  | "workspace.partners.manage"
  | "workspace.employees.manage"
  | "workspace.departments.manage"
  | "workspace.branches.manage"
  | "workspace.roles.manage"
  | "workspace.bir.view"
  | "workspace.sss_hdmf.view"
  // Dalia ERP
  | "hris.directory.view"
  | "hris.directory.manage"
  | "hris.jobs.view"
  | "hris.jobs.manage"
  | "hris.taxes.view"
  | "hris.taxes.manage"
  | "hris.payroll.view"
  | "hris.payroll.run"
  // Finance & Sales
  | "finance.invoices.view"
  | "finance.invoices.manage"
  | "finance.books.view"
  | "finance.tax_filings.manage"
  // Operations CRM
  | "crm.pipeline.view"
  | "crm.pipeline.manage"
  | "crm.retainers.manage";

export type AppModuleKey = "workspace" | "hris" | "finance" | "crm";

export interface UserPermissions {
  userId: string;
  companyId: string | null;
  permissions: Set<FeatureKey>;
}
