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
  HiOutlineMapPin,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
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

export function useWorkspaceState(
  initial: Workspace[] = fallbackWorkspaces,
  canManageFirm = true
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const companyIdParam = searchParams.get("company_id");

  const [createdWorkspaces, setCreatedWorkspaces] = React.useState<Workspace[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const workspaces = React.useMemo(() => {
    if (!canManageFirm) return initial;
    const seen = new Set(initial.map((w) => w.id));
    const extras = createdWorkspaces.filter((w) => !seen.has(w.id));
    return [...initial, ...extras];
  }, [initial, createdWorkspaces, canManageFirm]);

  const firmWorkspaceId = React.useMemo(
    () => workspaces.find((w) => w.isFirm)?.id ?? workspaces[0]?.id ?? "1",
    [workspaces]
  );

  const activeWorkspaceId = React.useMemo(
    () => resolveWorkspaceId(workspaces, companyIdParam),
    [workspaces, companyIdParam]
  );

  const activeWorkspace = React.useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId]
  );

  const isFirmWorkspace = Boolean(activeWorkspace?.isFirm);
  const isClientTenant = !canManageFirm;

  React.useEffect(() => {
    if (companyIdParam === activeWorkspaceId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("company_id", activeWorkspaceId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeWorkspaceId, companyIdParam, pathname, router, searchParams]);

  const navigateWithCompany = React.useCallback(
    (id: string, path: string = pathname) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("company_id", id);
      router.replace(`${path}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const navGroups = React.useMemo(() => {
    const href = (path: string) => withCompanyId(path, activeWorkspaceId);
    const backToApps = {
      title: "Applications",
      items: [
        {
          label: "Back to Apps",
          href: "/apps",
          Icon: HiOutlineSquares2X2,
        },
      ],
    };

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
              label: "Firm Users",
              href: href("/workspace/partners"),
              Icon: HiOutlineUserGroup,
            },
            {
              label: "Firm Roles",
              href: href("/workspace/roles"),
              Icon: HiOutlineIdentification,
            },
          ],
        },
        {
          title: "Audit & Governance",
          items: [
            {
              label: "Activity Logs",
              href: href("/workspace/activity-logs"),
              Icon: HiOutlineClipboardDocumentList,
            },
          ],
        },
        backToApps,
      ];
    }

    const clientGroups = [
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
            label: "Branches",
            href: href("/workspace/branches"),
            Icon: HiOutlineMapPin,
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
        title: "Audit & Governance",
        items: [
          {
            label: "Activity Logs",
            href: href("/workspace/activity-logs"),
            Icon: HiOutlineClipboardDocumentList,
          },
        ],
      },
    ];

    if (isClientTenant) {
      return [...clientGroups, backToApps];
    }

    return [
      ...clientGroups,
      {
        title: "Back to Firm",
        items: [
          { label: "Exit to Firm Panel", href: "EXIT_TO_FIRM", Icon: HiOutlineArrowLeft },
        ],
      },
      backToApps,
    ];
  }, [isFirmWorkspace, isClientTenant, activeWorkspaceId]);

  const handleSelectWorkspace = React.useCallback(
    (id: string) => {
      if (isClientTenant && id !== activeWorkspaceId) return;
      if (id === activeWorkspaceId) return;
      navigateWithCompany(id);
    },
    [activeWorkspaceId, isClientTenant, navigateWithCompany]
  );

  const handleExitToFirm = React.useCallback(() => {
    if (isClientTenant) return;
    router.push(withCompanyId("/workspace", firmWorkspaceId));
  }, [firmWorkspaceId, isClientTenant, router]);

  const handleCreateWorkspace = React.useCallback(
    async (data: { name: string; businessType?: string; adminEmail: string }) => {
      if (!canManageFirm) return;
      try {
        const dbWorkspace = await createWorkspaceAction(data);
        setCreatedWorkspaces((prev) => [...prev, dbWorkspace]);
        navigateWithCompany(dbWorkspace.id);
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    },
    [canManageFirm, navigateWithCompany]
  );

  return {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    isFirmWorkspace,
    isClientTenant,
    canManageFirm,
    firmWorkspaceId,
    createDialogOpen,
    setCreateDialogOpen,
    navGroups,
    handleSelectWorkspace,
    handleExitToFirm,
    handleCreateWorkspace,
  };
}
