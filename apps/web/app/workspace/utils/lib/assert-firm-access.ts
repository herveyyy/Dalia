import { getSessionTenant } from "./session-tenant";

/** Firm-level actions only — rejects client-company logins. */
export async function assertFirmAccess(companyId: string) {
  const tenant = await getSessionTenant();

  if (!tenant.session || tenant.error === "unauthorized") {
    throw new Error("Unauthorized");
  }

  if (!tenant.isFirmUser || !tenant.companyId) {
    throw new Error("Firm access only");
  }

  if (tenant.companyId !== companyId) {
    throw new Error("Firm access only");
  }

  return { session: tenant.session, firmCompanyId: tenant.companyId };
}
