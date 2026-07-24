"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@repo/auth/client";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { HiOutlineUserGroup, HiOutlineArrowLeft, HiOutlineBriefcase, HiOutlineCalculator } from "react-icons/hi2";

interface HrisShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  initialWorkspaces: any[];
}

export function HrisShell({ children, user, initialWorkspaces }: HrisShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState(initialWorkspaces[0]?.id ?? "1");

  const navGroups = React.useMemo(() => {
    return [
      {
        title: "HRIS Control Panel",
        items: [
          {
            label: "Employee Directory",
            href: "/hris",
            Icon: HiOutlineUserGroup,
            isActive: pathname === "/hris",
          },
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
      onCreateWorkspaceClick={() => {}}
      navGroups={navGroups}
      user={user}
      onLogoutClick={handleLogout}
    >
      {children}
    </AppShell>
  );
}
