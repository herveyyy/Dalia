"use client";

import * as React from "react";
import { Workspace } from "../types/workspace.types";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineFolderOpen,
} from "react-icons/hi2";

const initialWorkspaces: Workspace[] = [
  { id: "1", name: "Dalia Firm (Internal)", adminEmail: "partner@dalia.ph" },
  { id: "2", name: "Acme Logistics Inc.", adminEmail: "ceo@acmelogistics.com" },
  { id: "3", name: "Greenfield Bakery", adminEmail: "manager@greenfield.ph" },
];

export function useWorkspaceState() {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState("1");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const navGroups = React.useMemo(
    () => [
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
    ],
    []
  );

  const handleSelectWorkspace = React.useCallback((id: string) => {
    setActiveWorkspaceId(id);
  }, []);

  const handleCreateWorkspace = React.useCallback(
    (data: { name: string; adminEmail: string }) => {
      const newWorkspace: Workspace = {
        id: String(workspaces.length + 1),
        name: data.name,
        adminEmail: data.adminEmail,
      };
      setWorkspaces((prev) => [...prev, newWorkspace]);
      setActiveWorkspaceId(newWorkspace.id);
    },
    [workspaces.length]
  );

  const activeWorkspace = React.useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId]
  );

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    createDialogOpen,
    setCreateDialogOpen,
    navGroups,
    handleSelectWorkspace,
    handleCreateWorkspace,
  };
}
