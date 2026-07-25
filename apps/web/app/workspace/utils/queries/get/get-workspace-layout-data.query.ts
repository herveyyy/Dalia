import { Workspace } from "../../types/workspace.types";
import { getOverviewCompany } from "./get-overview-company.query";
import { getWorkspaceAdminInfo } from "./get-workspace-admin.query";

export async function getClientWorkspaceLayoutData(
  clientWorkspace: { id: string; name: string; adminEmail?: string | null },
  userEmail: string
): Promise<{ initialWorkspaces: Workspace[] }> {
  const adminEmail = clientWorkspace.adminEmail?.trim() || userEmail;
  const adminInfo = await getWorkspaceAdminInfo(clientWorkspace.id, adminEmail, userEmail);

  const initialWorkspaces: Workspace[] = [
    {
      id: clientWorkspace.id,
      name: clientWorkspace.name,
      adminEmail: adminInfo.resolvedAdmin || adminEmail,
      isFirm: false,
      adminHasLogin: adminInfo.adminHasLogin,
    },
  ];

  return { initialWorkspaces };
}

export async function getFirmWorkspaceLayoutData(
  userId: string,
  userEmail: string
): Promise<{ initialWorkspaces: Workspace[] }> {
  const overview = await getOverviewCompany(userId);

  const firmWorkspace: Workspace = overview?.company
    ? {
        id: overview.company.id,
        name: `${overview.company.name} (Internal)`,
        adminEmail: userEmail,
        isFirm: true,
      }
    : {
        id: "1",
        name: "Dalia Firm (Internal)",
        adminEmail: userEmail,
        isFirm: true,
      };

  const clientWorkspaces: Workspace[] = await Promise.all(
    (overview?.workspaces ?? []).map(async (w) => {
      const adminEmail = w.adminEmail?.trim() || "";
      const adminInfo = await getWorkspaceAdminInfo(w.id, adminEmail, userEmail);

      return {
        id: w.id,
        name: w.name,
        adminEmail: adminInfo.resolvedAdmin || userEmail,
        isFirm: false,
        adminHasLogin: adminInfo.adminHasLogin,
      };
    })
  );

  return {
    initialWorkspaces: [firmWorkspace, ...clientWorkspaces],
  };
}
