"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceContext } from "../context/workspace-context";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    createDialogOpen,
    setCreateDialogOpen,
    navGroups,
    handleSelectWorkspace,
    handleCreateWorkspace,
  } = useWorkspaceState();

  // Inject isActive based on current pathname
  const navGroupsWithActive = React.useMemo(
    () =>
      navGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          // Dashboard matches exactly; others match prefix
          isActive:
            item.href === "/workspace"
              ? pathname === "/workspace"
              : pathname.startsWith(item.href),
        })),
      })),
    [navGroups, pathname]
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        onSelectWorkspace: handleSelectWorkspace,
        openCreateDialog: () => setCreateDialogOpen(true),
      }}
    >
      <AppShell
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        onCreateWorkspaceClick={() => setCreateDialogOpen(true)}
        navGroups={navGroupsWithActive}
        user={{
          name: "Hervey Mapa",
          email: "hervey@dalia.ph",
        }}
        onLogoutClick={() => console.log("Logout triggered")}
      >
        {children}

        <CreateWorkspaceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreate={handleCreateWorkspace}
        />
      </AppShell>
    </WorkspaceContext.Provider>
  );
}
