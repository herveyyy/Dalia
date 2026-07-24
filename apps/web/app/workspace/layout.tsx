import * as React from "react";
import { Suspense } from "react";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "./utils/components/workspace-shell";
import { getOverviewCompany } from "./utils/queries/get/get-overview-company.query";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const overview = await getOverviewCompany(user.id);

  // Fallback to empty if not found
  const firmWorkspace = overview?.company
    ? {
        id: overview.company.id,
        name: `${overview.company.name} (Internal)`,
        adminEmail: user.email,
        isFirm: true,
      }
    : {
        id: "1",
        name: "Dalia Firm (Internal)",
        adminEmail: user.email,
        isFirm: true,
      };

  const clientWorkspaces = (overview?.workspaces ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    adminEmail: user.email, // or w.createdBy / some other email
    isFirm: false,
  }));

  const initialWorkspaces = [firmWorkspace, ...clientWorkspaces];

  return (
    <Suspense fallback={null}>
      <WorkspaceShell
        user={{
          name: user.name,
          email: user.email,
          avatarUrl: user.image ?? undefined,
        }}
        initialWorkspaces={initialWorkspaces}
      >
        {children}
      </WorkspaceShell>
    </Suspense>
  );
}
