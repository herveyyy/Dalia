"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@repo/auth/client";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import {
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineBriefcase,
  HiOutlineCalculator,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineDocumentText,
} from "react-icons/hi2";


interface HrisShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  initialWorkspaces: any[];
  canCreateWorkspace?: boolean;
}

export function HrisShell({
  children,
  user,
  initialWorkspaces,
  canCreateWorkspace = false,
}: HrisShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState(initialWorkspaces[0]?.id ?? "1");

  const navGroups = React.useMemo(() => {
    return [
      {
        title: "People & Directory",
        items: [
          {
            label: "Employee Directory",
            href: "/hris",
            Icon: HiOutlineUserGroup,
            isActive: pathname === "/hris",
          },
          {
            label: "Departments",
            href: "/hris/departments",
            Icon: HiOutlineBuildingOffice2,
            isActive: pathname === "/hris/departments",
          },
          {
            label: "Branches & Locations",
            href: "/hris/branches",
            Icon: HiOutlineMapPin,
            isActive: pathname === "/hris/branches",
          },
          {
            label: "Roles & Access",
            href: "/hris/roles",
            Icon: HiOutlineIdentification,
            isActive: pathname === "/hris/roles",
          },
        ],
      },
      {
        title: "Recruitment & Payroll",
        items: [
          {
            label: "Job Postings",
            href: "/hris/jobs",
            Icon: HiOutlineBriefcase,
            isActive: pathname === "/hris/jobs",
          },
          {
            label: "Tax Settings",
            href: "/hris/taxes",
            Icon: HiOutlineCalculator,
            isActive: pathname === "/hris/taxes",
          },
        ],
      },
      {
        title: "Statutory Tools",
        items: [
          {
            label: "BIR Alphalist",
            href: "/hris/bir-filing",
            Icon: HiOutlineShieldCheck,
            isActive: pathname === "/hris/bir-filing",
          },
          {
            label: "SSS / HDMF",
            href: "/hris/sss-hdmf",
            Icon: HiOutlineClock,
            isActive: pathname === "/hris/sss-hdmf",
          },
        ],
      },
      {
        title: "Audit & Governance",
        items: [
          {
            label: "Activity Logs",
            href: "/hris/activity-logs",
            Icon: HiOutlineDocumentText,
            isActive: pathname === "/hris/activity-logs",
          },
        ],
      },
      {
        title: "Back to Platform",

        items: [
          {
            label: "Back to App Menu",
            href: "/apps",
            Icon: HiOutlineArrowLeft,
            isActive: false,
          },
        ],
      },
    ];
  }, [pathname]);

  const handleLogout = React.useCallback(async () => {
    await signOut();
    window.location.href = "/login";
  }, []);

  const handleSelectWorkspace = React.useCallback((id: string) => {
    setActiveWorkspaceId(id);
    // Redirect to the platform workspace view when workspace is selected
    window.location.href = "/workspace";
  }, []);

  return (
    <AppShell
      workspaces={initialWorkspaces}
      activeWorkspaceId={activeWorkspaceId}
      onSelectWorkspace={handleSelectWorkspace}
      onCreateWorkspaceClick={canCreateWorkspace ? () => { window.location.href = "/workspace"; } : undefined}
      navGroups={navGroups}
      user={user}
      onLogoutClick={handleLogout}
    >
      {children}
    </AppShell>
  );
}
