import { redirect } from "next/navigation";
import { OrgBranchesPanel } from "../utils/components/org-branches-panel";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getBranchesWithEmployees } from "../utils/queries/get/get-org.query";

export default async function BranchesPage({
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

  const [companyRecord, branches] = await Promise.all([
    getCompanyRecord(companyId),
    getBranchesWithEmployees(companyId),
  ]);

  return (
    <OrgBranchesPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Client company"}
      branches={branches}
      page={page}
      itemsPerPage={items}
      viewMode={viewMode}
    />
  );
}
