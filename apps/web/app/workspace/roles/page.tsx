import { redirect } from "next/navigation";
import { OrgRolesPanel } from "../utils/components/org-roles-panel";
import { ensureAppAccessCatalog } from "../utils/lib/ensure-access-catalog";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getAppAccessCatalog, getRoles } from "../utils/queries/get/get-org.query";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string; page?: string; items?: string; view?: string }>;
}) {
  const { company_id: selectorId, page: pageStr, items: itemsStr, view: viewStr } = await searchParams;
  const page = Number(pageStr || 1);
  const items = Number(itemsStr || 20);
  const viewMode = (viewStr as "grid" | "rows") || "rows";

  const { companyId, error } = await resolveTenantCompanyId(selectorId);

  if (error === "unauthorized") redirect("/login");
  if (error === "forbidden" || !companyId) redirect("/workspace");

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
      page={page}
      itemsPerPage={items}
      viewMode={viewMode}
    />
  );
}
