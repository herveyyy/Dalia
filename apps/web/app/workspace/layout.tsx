import * as React from "react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserAppPermissions } from "@repo/db";
import { WorkspaceShell } from "./utils/components/workspace-shell";
import { getSessionTenant } from "./utils/lib/session-tenant";
import {
  getClientWorkspaceLayoutData,
  getFirmWorkspaceLayoutData,
} from "./utils/queries/get/get-workspace-layout-data.query";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getSessionTenant();

  if (!tenant.session) {
    redirect("/login");
  }

  const { user } = tenant.session;

  const permissions = await getUserAppPermissions(user.id);
  if (!permissions.hasModuleAccess("workspace")) {
    redirect("/apps?error=restricted");
  }

  // Client company admin/employee: only their workspace, no firm panel
  if (tenant.isClientTenant && tenant.clientWorkspace) {
    const { initialWorkspaces } = await getClientWorkspaceLayoutData(
      tenant.clientWorkspace,
      user.email
    );

    return (
      <Suspense fallback={null}>
        <WorkspaceShell
          user={{
            name: user.name,
            email: user.email,
            avatarUrl: user.image ?? undefined,
          }}
          initialWorkspaces={initialWorkspaces}
          canManageFirm={false}
        >
          {children}
        </WorkspaceShell>
      </Suspense>
    );
  }

  if (!tenant.isFirmUser) {
    redirect("/apps");
  }

  const { initialWorkspaces } = await getFirmWorkspaceLayoutData(
    user.id,
    user.email
  );

  return (
    <Suspense fallback={null}>
      <WorkspaceShell
        user={{
          name: user.name,
          email: user.email,
          avatarUrl: user.image ?? undefined,
        }}
        initialWorkspaces={initialWorkspaces}
        canManageFirm
      >
        {children}
      </WorkspaceShell>
    </Suspense>
  );
}
