"use client";

import * as React from "react";
import { Workspace } from "../types/workspace.types";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineFolderOpen,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

const initialWorkspaces: Workspace[] = [
  { id: "1", name: "Dalia Firm (Internal)", adminEmail: "partner@dalia.ph", isFirm: true },
  { id: "2", name: "Acme Logistics Inc.", adminEmail: "ceo@acmelogistics.com" },
  { id: "3", name: "Greenfield Bakery", adminEmail: "manager@greenfield.ph" },
];

import { createWorkspaceAction } from "../actions/workspace-actions";

export function useWorkspaceState(initial: Workspace[] = initialWorkspaces) {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(initial);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState(initial[0]?.id ?? "1");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const activeWorkspace = React.useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId]
  );

  const isFirmWorkspace = Boolean(activeWorkspace?.isFirm);

  const navGroups = React.useMemo(() => {
    if (isFirmWorkspace) {
      return [
        {
          title: "Firm Control Panel",
          items: [
            { label: "Dashboard", href: "/workspace", Icon: HiOutlineHome },
            { label: "Client Database", href: "/workspace/clients", Icon: HiOutlineFolderOpen },
          ],
        },
        {
          title: "Team & Staff",
          items: [
            { label: "Manage Partners", href: "/workspace/partners", Icon: HiOutlineUserGroup },
          ],
        },
      ];
    } else {
      return [
        {
          title: "Client Workspace",
          items: [
            { label: "Dashboard", href: "/workspace", Icon: HiOutlineHome },
          ],
        },
        {
          title: "Statutory Tools",
          items: [
            { label: "BIR Filing Alphalist", href: "/workspace/bir-filing", Icon: HiOutlineShieldCheck },
            { label: "SSS/HDMF Contributions", href: "/workspace/sss-hdmf", Icon: HiOutlineClock },
          ],
        },
        {
          title: "Back to Firm",
          items: [
            { label: "Exit to Firm Panel", href: "EXIT_TO_FIRM", Icon: HiOutlineArrowLeft },
          ],
        },
      ];
    }
  }, [isFirmWorkspace]);

  const handleSelectWorkspace = React.useCallback((id: string) => {
    setActiveWorkspaceId(id);
  }, []);

  const handleCreateWorkspace = React.useCallback(
    async (data: { name: string; adminEmail: string }) => {
      try {
        const dbWorkspace = await createWorkspaceAction(data);
        setWorkspaces((prev) => [...prev, dbWorkspace]);
        setActiveWorkspaceId(dbWorkspace.id);
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    },
    []
  );

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    isFirmWorkspace,
    createDialogOpen,
    setCreateDialogOpen,
    navGroups,
    handleSelectWorkspace,
    handleCreateWorkspace,
  };
}
