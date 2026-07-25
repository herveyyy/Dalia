import { redirect } from "next/navigation";
import { OrgEmployeesPanel } from "../utils/components/org-employees-panel";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getBranches, getDepartments, getEmployees, getRoles } from "../utils/queries/get/get-org.query";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string }>;
}) {
  const { company_id: selectorId } = await searchParams;
  const { companyId, error } = await resolveTenantCompanyId(selectorId);

  if (error === "unauthorized") redirect("/login");
  if (error === "forbidden" || !companyId) redirect("/workspace");

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
    />
  );
}
