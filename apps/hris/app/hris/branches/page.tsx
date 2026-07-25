import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrgBranchesPanel } from "../../../../web/app/workspace/utils/components/org-branches-panel";
import { getUserRecord, getCompanyRecord } from "../utils/queries/employee-queries";
import { getBranchesWithEmployees } from "../../../../web/app/workspace/utils/queries/get/get-org.query";

export default async function HrisBranchesPage(props: {
  searchParams?: Promise<{ page?: string; items?: string; view?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page || 1);
  const items = Number(searchParams?.items || 20);
  const viewMode = (searchParams?.view as "grid" | "rows") || "rows";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const userRecord = await getUserRecord(session.user.id);
  const companyId = userRecord?.companyId;

  if (!companyId) redirect("/apps");

  const [companyRecord, branches] = await Promise.all([
    getCompanyRecord(companyId),
    getBranchesWithEmployees(companyId),
  ]);

  return (
    <OrgBranchesPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Company"}
      branches={branches}
      page={page}
      itemsPerPage={items}
      viewMode={viewMode}
    />
  );
}
