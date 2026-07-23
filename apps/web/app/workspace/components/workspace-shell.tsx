"use client";

import * as React from "react";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceContext } from "../context/workspace-context";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
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
        navGroups={navGroups}
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
