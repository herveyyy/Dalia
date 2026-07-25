"use client";

import * as React from "react";
import { useWorkspace } from "./utils/context/workspace-context";
import { useDashboardStats } from "./utils/hooks/use-dashboard-stats";
import { FirmOverviewBoard } from "./utils/components/firm-overview-board";
import { CompanyWorkspaceDashboard } from "./utils/components/company-workspace-dashboard";

export default function WorkspacePage() {
  const {
    activeWorkspace,
    activeWorkspaceId,
    isFirmWorkspace,
    workspaces,
    onSelectWorkspace,
    openCreateDialog,
  } = useWorkspace();

  const { companyStats, firmStats } = useDashboardStats(
    activeWorkspaceId,
    isFirmWorkspace
  );

  const clientWorkspaces = React.useMemo(
    () => workspaces.filter((w) => !w.isFirm),
    [workspaces]
  );

  if (isFirmWorkspace) {
    return (
      <FirmOverviewBoard
        clientWorkspaces={clientWorkspaces}
        firmStats={firmStats}
        openCreateDialog={openCreateDialog}
        onSelectWorkspace={onSelectWorkspace}
      />
    );
  }

  return (
    <CompanyWorkspaceDashboard
      activeWorkspace={activeWorkspace}
      activeWorkspaceId={activeWorkspaceId}
      companyStats={companyStats}
    />
  );
}
