import { redirect } from "next/navigation";
import { FirmUsersPanel } from "../utils/components/firm-users-panel";
import { ensureAppAccessCatalog } from "../utils/lib/ensure-access-catalog";
import { getSessionTenant } from "../utils/lib/session-tenant";
import { getCompanyRecord } from "../utils/queries/get/get-company-record.query";
import { getFirmUsers } from "../utils/queries/get/get-firm-users.query";
import { getRoles } from "../utils/queries/get/get-org.query";

export default async function FirmUsersPage() {
  const tenant = await getSessionTenant();

  if (!tenant.session) redirect("/login");

  if (!tenant.isFirmUser || !tenant.companyId) {
    redirect(
      tenant.companyId
        ? `/workspace?company_id=${encodeURIComponent(tenant.companyId)}`
        : "/workspace"
    );
  }

  await ensureAppAccessCatalog();

  const companyId = tenant.companyId;
  const [companyRecord, users, roles] = await Promise.all([
    getCompanyRecord(companyId),
    getFirmUsers(companyId),
    getRoles(companyId),
  ]);

  return (
    <FirmUsersPanel
      companyId={companyId}
      companyName={companyRecord?.name || "Firm"}
      currentUserId={tenant.session.user.id}
      users={users}
      roles={roles}
    />
  );
}
