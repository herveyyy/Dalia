import { redirect } from "next/navigation";
import { OrgDepartmentsPanel } from "../utils/components/org-departments-panel";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getDepartmentsWithEmployees } from "../utils/queries/get/get-org.query";

export default async function DepartmentsPage({
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

  const [companyRecord, departments] = await Promise.all([
    getCompanyRecord(companyId),
    getDepartmentsWithEmployees(companyId),
  ]);

  return (
    <OrgDepartmentsPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Client company"}
      departments={departments}
      page={page}
      itemsPerPage={items}
      viewMode={viewMode}
    />
  );
}
