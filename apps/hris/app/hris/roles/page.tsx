import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrgRolesPanel } from "../../../../web/app/workspace/utils/components/org-roles-panel";
import { getUserRecord, getCompanyRecord } from "../utils/queries/employee-queries";
import { getAppAccessCatalog, getRoles } from "../../../../web/app/workspace/utils/queries/get/get-org.query";

export default async function HrisRolesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const userRecord = await getUserRecord(session.user.id);
  const companyId = userRecord?.companyId;

  if (!companyId) redirect("/apps");

  const [companyRecord, roles, catalog] = await Promise.all([
    getCompanyRecord(companyId),
    getRoles(companyId),
    getAppAccessCatalog(),
  ]);

  return (
    <OrgRolesPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Company"}
      roles={roles}
      catalog={catalog}
    />
  );
}
