"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceContext } from "../context/workspace-context";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
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
    handleCreateWorkspace,
  } = useWorkspaceState();

  // Inject isActive and custom click handlers based on current pathname
  const navGroupsWithActive = React.useMemo(
    () =>
      navGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          const isExitLink = item.href === "EXIT_TO_FIRM";
          
          return {
            ...item,
            // Override href for Javascript actions so they don't perform page navigations
            href: isExitLink ? "#" : item.href,
            isActive: isExitLink
              ? false
              : item.href === "/workspace"
                ? pathname === "/workspace"
                : pathname.startsWith(item.href),
            onClick: isExitLink
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                  // Switch to Firm workspace
                  handleSelectWorkspace("1");
                  // Always push to main workspace route
                  router.push("/workspace");
                }
              : undefined,
          };
        }),
      })),
    [navGroups, pathname, handleSelectWorkspace, router]
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspaceId,
        activeWorkspace,
        isFirmWorkspace,
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
