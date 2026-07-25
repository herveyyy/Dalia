import { db, company, eq, sql, workspace, getUserAppPermissions } from "@repo/db";
import {
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { AppCardItem, AppsPageData } from "../types/apps.types";

export async function getAppsPageData(
  userId: string,
  userCompanyId?: string | null
): Promise<AppsPageData> {
  try {
    const userPermissions = await getUserAppPermissions(userId);
    const hasWorkspacePermission = userPermissions.hasModuleAccess("workspace");
    const hasHrisPermission = userPermissions.hasModuleAccess("hris");

    const companyRecord = userCompanyId
      ? await db
          .select()
          .from(company)
          .where(eq(company.id, userCompanyId))
          .then((res) => res[0])
      : null;
    const companyName = companyRecord?.name || null;

    const clientWorkspace = userCompanyId
      ? await db
          .select({ id: workspace.id })
          .from(workspace)
          .where(sql`${workspace.id}::text = ${userCompanyId}`)
          .then((res) => res[0] ?? null)
      : null;

    const apps: AppCardItem[] = [
      ...(!clientWorkspace
        ? [
            {
              id: "firm-workspace",
              name: "Firm Workspace",
              description:
                "Manage client workspaces, firm users, and company compliance.",
              icon: HiOutlineHome,
              href: "/workspace",
              status: (hasWorkspacePermission ? "active" : "restricted") as AppCardItem["status"],
              statusLabel: hasWorkspacePermission
                ? "Open Workspace"
                : "Access Restricted",
            },
          ]
        : [
            {
              id: "company-workspace",
              name: "Company Workspace",
              description:
                "Manage employees, departments, and roles for your company only.",
              icon: HiOutlineBuildingOffice2,
              href: `/workspace?company_id=${encodeURIComponent(clientWorkspace.id)}`,
              status: (hasWorkspacePermission ? "active" : "restricted") as AppCardItem["status"],
              statusLabel: hasWorkspacePermission
                ? "Open Workspace"
                : "Access Restricted",
            },
          ]),
      {
        id: "hris",
        name: "HRIS & Payroll",
        description:
          "Philippines statutory payroll, automated timekeeping, and employee files.",
        icon: HiOutlineShieldCheck,
        href: "/hris",
        status: (hasHrisPermission ? "active" : "restricted") as AppCardItem["status"],
        statusLabel: hasHrisPermission ? "Launch App" : "Access Restricted",
      },
      {
        id: "finance",
        name: "Finance & Sales",
        description:
          "Invoicing, automated bookkeeping, and tax filings for MSMEs.",
        icon: HiOutlineBuildingOffice2,
        href: "#",
        status: "coming_soon" as const,
        statusLabel: "Request Early Access",
      },
      {
        id: "crm",
        name: "Operations CRM",
        description:
          "Manage client retainers, task pipelines, and firm operations in one place.",
        icon: HiOutlineRocketLaunch,
        href: "#",
        status: "coming_soon" as const,
        statusLabel: "Request Early Access",
      },
    ];

    return { companyName, apps };
  } catch (error) {
    console.error("Error fetching apps page data:", error);
    return {
      companyName: null,
      apps: [
        {
          id: "firm-workspace",
          name: "Firm Workspace",
          description: "Manage client workspaces, firm users, and company compliance.",
          icon: HiOutlineHome,
          href: "/workspace",
          status: "restricted",
          statusLabel: "Access Restricted",
        },
        {
          id: "hris",
          name: "HRIS & Payroll",
          description: "Philippines statutory payroll, automated timekeeping, and employee files.",
          icon: HiOutlineShieldCheck,
          href: "/hris",
          status: "restricted",
          statusLabel: "Access Restricted",
        },
        {
          id: "finance",
          name: "Finance & Sales",
          description: "Invoicing, automated bookkeeping, and tax filings for MSMEs.",
          icon: HiOutlineBuildingOffice2,
          href: "#",
          status: "coming_soon",
          statusLabel: "Request Early Access",
        },
        {
          id: "crm",
          name: "Operations CRM",
          description: "Manage client retainers, task pipelines, and firm operations in one place.",
          icon: HiOutlineRocketLaunch,
          href: "#",
          status: "coming_soon",
          statusLabel: "Request Early Access",
        },
      ],
    };
  }
}
