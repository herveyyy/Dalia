import { db, eq, workspace } from "@repo/db";
import { getSessionTenant } from "./session-tenant";

/**
 * Resolves the tenant company id for workspace HR data from ?company_id=.
 * - Firm user: firm company id, or a client workspace they own
 * - Client tenant: always their own company id only
 */
export async function resolveTenantCompanyId(selectorId: string | undefined | null) {
  const tenant = await getSessionTenant();

  if (tenant.error === "unauthorized" || !tenant.session) {
    return { session: null, companyId: null as string | null, error: "unauthorized" as const };
  }

  if (tenant.error === "no_company" || !tenant.companyId) {
    return { session: tenant.session, companyId: null, error: "no_company" as const };
  }

  // Client employee/admin: locked to their company — never firm or other clients
  if (tenant.isClientTenant) {
    if (selectorId && selectorId !== tenant.companyId) {
      return { session: tenant.session, companyId: null, error: "forbidden" as const };
    }
    return { session: tenant.session, companyId: tenant.companyId, error: null };
  }

  const firmCompanyId = tenant.companyId;

  if (!selectorId || selectorId === firmCompanyId) {
    return { session: tenant.session, companyId: firmCompanyId, error: null };
  }

  const [clientWorkspace] = await db
    .select({ id: workspace.id, companyId: workspace.companyId })
    .from(workspace)
    .where(eq(workspace.id, selectorId))
    .limit(1);

  if (!clientWorkspace || clientWorkspace.companyId !== firmCompanyId) {
    return { session: tenant.session, companyId: null, error: "forbidden" as const };
  }

  return { session: tenant.session, companyId: clientWorkspace.id, error: null };
}
