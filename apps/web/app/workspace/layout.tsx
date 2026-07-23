"use client";

import * as React from "react";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineFolderOpen,
} from "react-icons/hi2";

export interface Workspace {
  id: string;
  name: string;
  adminEmail: string;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace?: Workspace;
  onSelectWorkspace: (id: string) => void;
  openCreateDialog: () => void;
}

export const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export function useWorkspace() {
  const ctx = React.useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceLayout");
  }
  return ctx;
}

const initialWorkspaces: Workspace[] = [
  { id: "1", name: "Dalia Firm (Internal)", adminEmail: "partner@dalia.ph" },
  { id: "2", name: "Acme Logistics Inc.", adminEmail: "ceo@acmelogistics.com" },
  { id: "3", name: "Greenfield Bakery", adminEmail: "manager@greenfield.ph" },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workspaces, setWorkspaces] = React.useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState("1");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const navGroups = [
    {
      title: "Navigation",
      items: [
        { label: "Dashboard", href: "/workspace", Icon: HiOutlineHome, isActive: true },
        { label: "Client Database", href: "#", Icon: HiOutlineFolderOpen },
      ],
    },
    {
      title: "Statutory Tools",
      items: [
        { label: "BIR Filing Alphalist", href: "#", Icon: HiOutlineShieldCheck },
        { label: "SSS/HDMF Contributions", href: "#", Icon: HiOutlineClock },
      ],
    },
    {
      title: "Team & Staff",
      items: [
        { label: "Manage Partners", href: "#", Icon: HiOutlineUserGroup },
      ],
    },
  ];

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
  };

  const handleCreateWorkspace = (data: { name: string; adminEmail: string }) => {
    const newWorkspace = {
      id: String(workspaces.length + 1),
      name: data.name,
      adminEmail: data.adminEmail,
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

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
