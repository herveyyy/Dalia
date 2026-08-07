import * as React from "react";
import { getSafeSession } from "@repo/auth";
import { getUserAppPermissions } from "@repo/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HrisShell } from "./utils/components/hris-shell";
import { getCompanyRecord, getCompanyWorkspaces, getUserRecord } from "./utils/queries/employee-queries";

export default async function HrisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const permissions = await getUserAppPermissions(user.id);
  if (!permissions.hasModuleAccess("hris")) {
    redirect("/apps?error=restricted");
  }

  const userRecord = await getUserRecord(user.id);
  const companyRecord = userRecord?.companyId ? await getCompanyRecord(userRecord.companyId) : null;
  const workspacesList = userRecord?.companyId
    ? await getCompanyWorkspaces(userRecord.companyId)
    : [];

  const firmWorkspace = companyRecord
    ? {
        id: companyRecord.id,
        name: `${companyRecord.name} (Internal)`,
        adminEmail: user.email,
        isFirm: true,
      }
    : {
        id: "1",
        name: "Dalia Firm (Internal)",
        adminEmail: user.email,
        isFirm: true,
      };

  const clientWorkspaces = workspacesList.map((w) => ({
    id: w.id,
    name: w.name,
    adminEmail: user.email,
    isFirm: false,
  }));

  const initialWorkspaces = [firmWorkspace, ...clientWorkspaces];

  const canCreateWorkspace = permissions.hasFeatureAccess("workspace.clients.manage") || permissions.isOwnerOrAdmin;

  return (
    <HrisShell
      user={{
        name: user.name,
        email: user.email,
        avatarUrl: user.image ?? undefined,
      }}
      initialWorkspaces={initialWorkspaces}
      canCreateWorkspace={canCreateWorkspace}
    >
      {children}
    </HrisShell>
  );
}
