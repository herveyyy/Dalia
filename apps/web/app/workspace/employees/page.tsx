import { redirect } from "next/navigation";
import { OrgEmployeesPanel } from "../utils/components/org-employees-panel";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getBranches, getDepartments, getEmployees, getRoles } from "../utils/queries/get/get-org.query";

export default async function EmployeesPage({
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
  if (error === "forbidden") redirect("/workspace");
  if (!companyId) redirect("/workspace");

  const [companyRecord, employees, departments, branches, roles] = await Promise.all([
    getCompanyRecord(companyId),
    getEmployees(companyId),
    getDepartments(companyId),
    getBranches(companyId),
    getRoles(companyId),
  ]);

  return (
    <OrgEmployeesPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Client company"}
      employees={employees}
      departments={departments}
      branches={branches}
      roles={roles}
      page={page}
      itemsPerPage={items}
      viewMode={viewMode}
    />
  );
}
