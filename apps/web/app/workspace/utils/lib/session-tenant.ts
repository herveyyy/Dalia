import { auth } from "@repo/auth";
import { db, eq, sql, user, workspace } from "@repo/db";
import { headers } from "next/headers";

/**
 * Firm users: user.companyId is a firm company (not a workspace row).
 * Client tenants: user.companyId is a workspace.id (= client company id).
 */
export async function getSessionTenant() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      session: null,
      companyId: null as string | null,
      isClientTenant: false,
      isFirmUser: false,
      error: "unauthorized" as const,
    };
  }

  const [userRecord] = await db
    .select({ companyId: user.companyId })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const companyId = userRecord?.companyId ?? null;
  if (!companyId) {
    return {
      session,
      companyId: null,
      isClientTenant: false,
      isFirmUser: false,
      error: "no_company" as const,
    };
  }

  // user.companyId is text; workspace.id is uuid
  const [clientWorkspace] = await db
    .select({
      id: workspace.id,
      name: workspace.name,
      adminEmail: workspace.adminEmail,
      firmCompanyId: workspace.companyId,
    })
    .from(workspace)
    .where(sql`${workspace.id}::text = ${companyId}`)
    .limit(1);

  if (clientWorkspace) {
    return {
      session,
      companyId: clientWorkspace.id,
      clientWorkspace,
      isClientTenant: true as const,
      isFirmUser: false as const,
      error: null,
    };
  }

  return {
    session,
    companyId,
    clientWorkspace: null,
    isClientTenant: false as const,
    isFirmUser: true as const,
    error: null,
  };
}
