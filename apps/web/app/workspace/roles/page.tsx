import { redirect } from "next/navigation";
import { OrgRolesPanel } from "../utils/components/org-roles-panel";
import { ensureAppAccessCatalog } from "../utils/lib/ensure-access-catalog";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getAppAccessCatalog, getRoles } from "../utils/queries/get/get-org.query";

import { enforcePermission } from "../utils/lib/rbac-server";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string }>;
}) {
  const { company_id: selectorId } = await searchParams;

  // 🔒 RBAC Permission Guard: Requires 'workspace.roles.manage'
  const { session, companyId } = await enforcePermission("workspace.roles.manage", selectorId);
  if (!companyId) redirect("/workspace");

  await ensureAppAccessCatalog();

  const [companyRecord, roles, catalog] = await Promise.all([
    getCompanyRecord(companyId),
    getRoles(companyId),
    getAppAccessCatalog(),
  ]);

  return (
    <OrgRolesPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Client company"}
      roles={roles}
      catalog={catalog}
    />
  );
}
