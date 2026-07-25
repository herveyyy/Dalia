import * as React from "react";
import { CompanyStats, FirmStats } from "../types/dashboard.types";
import {
  getCompanyDashboardStatsAction,
  getFirmDashboardStatsAction,
} from "../actions/org-actions";

export function useDashboardStats(
  activeWorkspaceId: string,
  isFirmWorkspace: boolean
) {
  const [companyStats, setCompanyStats] = React.useState<CompanyStats | null>(null);
  const [firmStats, setFirmStats] = React.useState<FirmStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (isFirmWorkspace && activeWorkspaceId) {
      getFirmDashboardStatsAction(activeWorkspaceId)
        .then((data) => {
          if (isMounted) {
            setFirmStats(data);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    } else if (activeWorkspaceId) {
      getCompanyDashboardStatsAction(activeWorkspaceId)
        .then((data) => {
          if (isMounted) {
            setCompanyStats(data);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isFirmWorkspace, activeWorkspaceId]);

  return { companyStats, firmStats, isLoading };
}
