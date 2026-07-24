"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineFolderOpen,
  HiOutlineArrowLeft,
  HiOutlineBuildingOffice2,
  HiOutlineIdentification,
  HiOutlineUsers,
} from "react-icons/hi2";
import { Workspace } from "../types/workspace.types";
import { createWorkspaceAction } from "../actions/workspace-actions";

const fallbackWorkspaces: Workspace[] = [
  { id: "1", name: "Dalia Firm (Internal)", adminEmail: "partner@dalia.ph", isFirm: true },
  { id: "2", name: "Acme Logistics Inc.", adminEmail: "ceo@acmelogistics.com" },
  { id: "3", name: "Greenfield Bakery", adminEmail: "manager@greenfield.ph" },
];

function resolveWorkspaceId(workspaces: Workspace[], companyId: string | null) {
  const firmId = workspaces.find((w) => w.isFirm)?.id ?? workspaces[0]?.id ?? "1";
  if (companyId && workspaces.some((w) => w.id === companyId)) {
    return companyId;
  }
  return firmId;
}

function withCompanyId(href: string, companyId: string) {
  const [path] = href.split("?");
  return `${path}?company_id=${encodeURIComponent(companyId)}`;
}

export function useWorkspaceState(initial: Workspace[] = fallbackWorkspaces) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const companyIdParam = searchParams.get("company_id");

  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(initial);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const firmWorkspaceId = React.useMemo(
    () => workspaces.find((w) => w.isFirm)?.id ?? workspaces[0]?.id ?? "1",
    [workspaces]
  );

  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState(() =>
    resolveWorkspaceId(initial, companyIdParam)
  );

  // Keep list in sync if the server layout re-fetches workspaces
  React.useEffect(() => {
    setWorkspaces(initial);
  }, [initial]);

  // Sync selection from ?company_id= (empty/invalid → firm)
  React.useEffect(() => {
    const nextId = resolveWorkspaceId(workspaces, companyIdParam);
    setActiveWorkspaceId((prev) => (prev === nextId ? prev : nextId));
  }, [companyIdParam, workspaces]);

  // Ensure the URL always has a valid company_id once mounted
  React.useEffect(() => {
    if (companyIdParam === activeWorkspaceId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("company_id", activeWorkspaceId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeWorkspaceId, companyIdParam, pathname, router, searchParams]);

  const activeWorkspace = React.useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId]
  );

  const isFirmWorkspace = Boolean(activeWorkspace?.isFirm);

  const navGroups = React.useMemo(() => {
    const href = (path: string) => withCompanyId(path, activeWorkspaceId);

    if (isFirmWorkspace) {
      return [
        {
          title: "Firm Control Panel",
          items: [
            { label: "Dashboard", href: href("/workspace"), Icon: HiOutlineHome },
            { label: "Client Database", href: href("/workspace/clients"), Icon: HiOutlineFolderOpen },
          ],
        },
        {
          title: "Team & Staff",
          items: [
            {
              label: "Manage Partners",
              href: href("/workspace/partners"),
              Icon: HiOutlineUserGroup,
            },
          ],
        },
      ];
    }

    return [
      {
        title: "Client Workspace",
        items: [{ label: "Dashboard", href: href("/workspace"), Icon: HiOutlineHome }],
      },
      {
        title: "People & Org",
        items: [
          {
            label: "Employees",
            href: href("/workspace/employees"),
            Icon: HiOutlineUsers,
          },
          {
            label: "Departments",
            href: href("/workspace/departments"),
            Icon: HiOutlineBuildingOffice2,
          },
          {
            label: "Roles",
            href: href("/workspace/roles"),
            Icon: HiOutlineIdentification,
          },
        ],
      },
      {
        title: "Statutory Tools",
        items: [
          {
            label: "BIR Filing Alphalist",
            href: href("/workspace/bir-filing"),
            Icon: HiOutlineShieldCheck,
          },
          {
            label: "SSS/HDMF Contributions",
            href: href("/workspace/sss-hdmf"),
            Icon: HiOutlineClock,
          },
        ],
      },
      {
        title: "Back to Firm",
        items: [
          { label: "Exit to Firm Panel", href: "EXIT_TO_FIRM", Icon: HiOutlineArrowLeft },
        ],
      },
    ];
  }, [isFirmWorkspace, activeWorkspaceId]);

  const handleSelectWorkspace = React.useCallback(
    (id: string) => {
      setActiveWorkspaceId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("company_id", id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleExitToFirm = React.useCallback(() => {
    setActiveWorkspaceId(firmWorkspaceId);
    router.push(withCompanyId("/workspace", firmWorkspaceId));
  }, [firmWorkspaceId, router]);

  const handleCreateWorkspace = React.useCallback(
    async (data: { name: string; adminEmail: string }) => {
      try {
        const dbWorkspace = await createWorkspaceAction(data);
        setWorkspaces((prev) => [...prev, dbWorkspace]);
        setActiveWorkspaceId(dbWorkspace.id);
        const params = new URLSearchParams(searchParams.toString());
        params.set("company_id", dbWorkspace.id);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    },
    [pathname, router, searchParams]
  );

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    isFirmWorkspace,
    firmWorkspaceId,
    createDialogOpen,
    setCreateDialogOpen,
    navGroups,
    handleSelectWorkspace,
    handleExitToFirm,
    handleCreateWorkspace,
  };
}
