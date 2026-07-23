import * as React from "react";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "./utils/components/workspace-shell";

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

  return (
    <WorkspaceShell
      user={{
        name: user.name,
        email: user.email,
        avatarUrl: user.image ?? undefined,
      }}
    >
      {children}
    </WorkspaceShell>
  );
}
