/** Seed catalog — add apps/features here; synced into DB on ensureAppAccessCatalog(). */

export type AppFeatureSeed = {
  key: string;
  name: string;
  description?: string;
};

export type AppModuleSeed = {
  key: string;
  name: string;
  description?: string;
  features: AppFeatureSeed[];
};

export const APP_ACCESS_CATALOG: AppModuleSeed[] = [
  {
    key: "workspace",
    name: "Firm Workspace",
    description: "Multi-client firm control panel",
    features: [
      { key: "dashboard.view", name: "View dashboard" },
      { key: "clients.manage", name: "Manage client workspaces" },
      { key: "partners.manage", name: "Manage partners" },
      { key: "employees.manage", name: "Manage employees" },
      { key: "departments.manage", name: "Manage departments" },
      { key: "roles.manage", name: "Manage roles & access" },
      { key: "bir.view", name: "BIR filing tools" },
      { key: "sss_hdmf.view", name: "SSS/HDMF tools" },
    ],
  },
  {
    key: "hris",
    name: "Dalia HRIS",
    description: "Payroll, timekeeping, and employee files",
    features: [
      { key: "directory.view", name: "View employee directory" },
      { key: "directory.manage", name: "Create/edit employees" },
      { key: "jobs.view", name: "View job postings" },
      { key: "jobs.manage", name: "Manage job postings" },
      { key: "taxes.view", name: "View tax settings" },
      { key: "taxes.manage", name: "Manage tax settings" },
      { key: "payroll.view", name: "View payroll" },
      { key: "payroll.run", name: "Run payroll" },
    ],
  },
  {
    key: "finance",
    name: "Finance & Sales",
    description: "Invoicing and bookkeeping (coming soon)",
    features: [
      { key: "invoices.view", name: "View invoices" },
      { key: "invoices.manage", name: "Manage invoices" },
      { key: "books.view", name: "View books" },
      { key: "tax_filings.manage", name: "Manage tax filings" },
    ],
  },
  {
    key: "crm",
    name: "Operations CRM",
    description: "Client retainers and pipelines (coming soon)",
    features: [
      { key: "pipeline.view", name: "View pipeline" },
      { key: "pipeline.manage", name: "Manage pipeline" },
      { key: "retainers.manage", name: "Manage retainers" },
    ],
  },
];
