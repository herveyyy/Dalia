import { redirect } from "next/navigation";
import { OrgDepartmentsPanel } from "../utils/components/org-departments-panel";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getDepartmentsWithEmployees } from "../utils/queries/get/get-org.query";

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string }>;
}) {
  const { company_id: selectorId } = await searchParams;
  const { companyId, error } = await resolveTenantCompanyId(selectorId);

  if (error === "unauthorized") redirect("/login");
  if (!companyId) redirect("/workspace");

  const [companyRecord, departments] = await Promise.all([
    getCompanyRecord(companyId),
    getDepartmentsWithEmployees(companyId),
  ]);

  return (
    <OrgDepartmentsPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Client company"}
      departments={departments}
    />
  );
}
