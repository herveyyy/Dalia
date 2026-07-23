"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@repo/auth/client";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceContext } from "../context/workspace-context";

interface WorkspaceShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export function WorkspaceShell({ children, user }: WorkspaceShellProps) {
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
                  handleSelectWorkspace("1");
                  router.push("/workspace");
                }
              : undefined,
          };
        }),
      })),
    [navGroups, pathname, handleSelectWorkspace, router]
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
        user={user}
        onLogoutClick={handleLogout}
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
