import { redirect } from "next/navigation";
import { OrgRolesPanel } from "../utils/components/org-roles-panel";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getRoles } from "../utils/queries/get/get-org.query";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<{ company_id?: string }>;
}) {
  const { company_id: selectorId } = await searchParams;
  const { companyId, error } = await resolveTenantCompanyId(selectorId);

  if (error === "unauthorized") redirect("/login");
  if (!companyId) redirect("/workspace");

  const [companyRecord, roles] = await Promise.all([
    getCompanyRecord(companyId),
    getRoles(companyId),
  ]);

  return (
    <OrgRolesPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Client company"}
      roles={roles}
    />
  );
}
