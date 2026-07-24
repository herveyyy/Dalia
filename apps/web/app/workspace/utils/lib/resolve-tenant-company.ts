import { auth } from "@repo/auth";
import { db, eq, user, workspace } from "@repo/db";
import { headers } from "next/headers";

/**
 * Resolves the tenant company id for workspace HR data from ?company_id=.
 * Firm panel → firm company id. Client workspace → workspace id (= client company id).
 */
export async function resolveTenantCompanyId(selectorId: string | undefined | null) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { session: null, companyId: null as string | null, error: "unauthorized" as const };
  }

  const [userRecord] = await db
    .select({ companyId: user.companyId })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const firmCompanyId = userRecord?.companyId ?? null;
  if (!firmCompanyId) {
    return { session, companyId: null, error: "no_company" as const };
  }

  if (!selectorId || selectorId === firmCompanyId) {
    return { session, companyId: firmCompanyId, error: null };
  }

  const [clientWorkspace] = await db
    .select({ id: workspace.id, companyId: workspace.companyId })
    .from(workspace)
    .where(eq(workspace.id, selectorId))
    .limit(1);

  if (!clientWorkspace || clientWorkspace.companyId !== firmCompanyId) {
    return { session, companyId: null, error: "forbidden" as const };
  }

  return { session, companyId: clientWorkspace.id, error: null };
}
