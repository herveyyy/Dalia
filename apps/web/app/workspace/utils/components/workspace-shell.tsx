"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@repo/auth/client";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceContext } from "../context/workspace-context";
import { Workspace } from "../types/workspace.types";

interface WorkspaceShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  initialWorkspaces: Workspace[];
  canManageFirm?: boolean;
}

export function WorkspaceShell({
  children,
  user,
  initialWorkspaces,
  canManageFirm = true,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    isFirmWorkspace,
    createDialogOpen,
    setCreateDialogOpen,
    navGroups,
    handleSelectWorkspace,
    handleExitToFirm,
    handleCreateWorkspace,
  } = useWorkspaceState(initialWorkspaces, canManageFirm);

  const navGroupsWithActive = React.useMemo(
    () =>
      navGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          const isExitLink = item.href === "EXIT_TO_FIRM";
          const itemPath = item.href.split("?")[0] ?? item.href;

          return {
            ...item,
            href: isExitLink ? "#" : item.href,
            isActive: isExitLink
              ? false
              : itemPath === "/workspace"
                ? pathname === "/workspace"
                : pathname.startsWith(itemPath),
            onClick: isExitLink
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                  handleExitToFirm();
                }
              : undefined,
          };
        }),
      })),
    [navGroups, pathname, handleExitToFirm]
  );

  const handleLogout = React.useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [router]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        isFirmWorkspace,
        canManageFirm,
        onSelectWorkspace: handleSelectWorkspace,
        openCreateDialog: () => {
          if (canManageFirm) setCreateDialogOpen(true);
        },
      }}
    >
      <AppShell
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        onCreateWorkspaceClick={
          canManageFirm ? () => setCreateDialogOpen(true) : undefined
        }
        canManageFirm={canManageFirm}
        navGroups={navGroupsWithActive}
        user={user}
        onLogoutClick={handleLogout}
      >
        {children}

        {canManageFirm ? (
          <CreateWorkspaceDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onCreate={handleCreateWorkspace}
          />
        ) : null}
      </AppShell>
    </WorkspaceContext.Provider>
  );
}
