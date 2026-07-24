"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/molecules/Card";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiOutlineHome,
  HiOutlineEnvelopeOpen,
  HiPlus,
  HiOutlineFolderOpen,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import { useWorkspace } from "./utils/context/workspace-context";
import { getCompanyDashboardStatsAction, getFirmDashboardStatsAction } from "./utils/actions/org-actions";
import Link from "next/link";

interface BranchStat {
  id: string;
  name: string;
  code: string | null;
  address: string | null;
  employeeCount: number;
}

interface CompanyStats {
  totalEmployees: number;
  activeEmployees: number;
  totalBranches: number;
  totalDepartments: number;
  branchBreakdown: BranchStat[];
  unassignedBranchCount: number;
}

interface FirmClientStat {
  id: string;
  name: string;
  businessType?: string | null;
  adminEmail?: string | null;
  employeeCount: number;
  branchCount: number;
}

interface FirmStats {
  totalClients: number;
  totalEmployees: number;
  clientStats: FirmClientStat[];
}

export default function WorkspacePage() {
  const { activeWorkspace, activeWorkspaceId, isFirmWorkspace, workspaces, onSelectWorkspace, openCreateDialog } =
    useWorkspace();

  const [companyStats, setCompanyStats] = React.useState<CompanyStats | null>(null);
  const [firmStats, setFirmStats] = React.useState<FirmStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Filter client workspaces (exclude firm workspace itself)
  const clientWorkspaces = React.useMemo(
    () => workspaces.filter((w) => !w.isFirm),
    [workspaces]
  );

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

  // Mock compliance statuses for demo
  const statusColors: Record<string, string> = {
    Filed: "bg-green-500/10 text-green-600",
    Remitted: "bg-green-500/10 text-green-600",
    Pending: "bg-amber-500/10 text-amber-600",
  };

  if (isFirmWorkspace) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
              Firm Overview Board
            </h1>
            <p className="mt-1.5 text-base text-muted-foreground">
              Central control panel managing stats & compliance across all client entities.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 self-start font-display">
            <HiPlus className="size-4" />
            New Client Workspace
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Client Companies",
              value: firmStats?.totalClients ?? clientWorkspaces.length,
              sub: "Managed workspaces",
              Icon: HiOutlineFolderOpen,
            },
            {
              label: "Total Client Headcount",
              value: firmStats?.totalEmployees ?? "—",
              sub: "Employees across clients",
              Icon: HiOutlineUsers,
            },
            {
              label: "Statutory Filings Status",
              value: "2026 Ready",
              sub: "SSS, PhilHealth, BIR 1601-C",
              Icon: HiOutlineShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.Icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{item.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
              </div>
            );
          })}
        </div>

        {/* Client Companies Overview Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-5 bg-muted/20">
            <div>
              <h2 className="text-base font-bold text-foreground">Client Companies Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overview stats across client branches, workforce, and statutory status.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <th className="px-6 py-3">Client Company</th>
                  <th className="px-6 py-3">Business Type</th>
                  <th className="px-6 py-3">Branches</th>
                  <th className="px-6 py-3">Employees</th>
                  <th className="px-6 py-3">BIR / SSS Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {clientWorkspaces.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No client workspaces created yet. Click &quot;New Client Workspace&quot; above to create one.
                    </td>
                  </tr>
                ) : (
                  clientWorkspaces.map((client) => {
                    const stat = firmStats?.clientStats.find((s) => s.id === client.id);

                    return (
                      <tr key={client.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-foreground">{client.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{client.adminEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                            {stat?.businessType || "General Business"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {stat?.branchCount ?? 1} branch{(stat?.branchCount ?? 1) === 1 ? "" : "es"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {stat?.employeeCount ?? 0} employees
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-green-600">
                            Compliant
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectWorkspace(client.id)}
                            className="gap-1.5 hover:bg-primary/10 hover:text-primary font-display"
                          >
                            Open Workspace
                            <HiOutlineArrowRight className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Client Company Workspace Dashboard (Company Stats Across Branches)
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
              {activeWorkspace?.name}
            </h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Company Dashboard
            </span>
          </div>
          <p className="mt-1.5 text-base text-muted-foreground">
            Overview statistics for <span className="font-semibold text-foreground">{activeWorkspace?.name}</span> across all branches and operating locations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/workspace/branches?company_id=${encodeURIComponent(activeWorkspaceId)}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-muted transition-colors font-display"
          >
            <HiOutlineMapPin className="size-4" />
            Manage Branches
          </Link>
          <Link
            href={`/workspace/employees?company_id=${encodeURIComponent(activeWorkspaceId)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors font-display"
          >
            <HiOutlineUsers className="size-4" />
            View Employees
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Employees",
            value: companyStats ? companyStats.totalEmployees : "—",
            sub: companyStats ? `${companyStats.activeEmployees} active employees` : "Loading headcount…",
            Icon: HiOutlineUsers,
          },
          {
            label: "Operating Branches",
            value: companyStats ? companyStats.totalBranches : "—",
            sub: companyStats && companyStats.totalBranches > 0 ? "Active branch locations" : "1 Main Location",
            Icon: HiOutlineMapPin,
          },
          {
            label: "Departments",
            value: companyStats ? companyStats.totalDepartments : "—",
            sub: "Org units configured",
            Icon: HiOutlineBuildingOffice2,
          },
          {
            label: "2026 Statutory Status",
            value: "Compliant",
            sub: "BIR 1601-C, SSS, PhilHealth",
            Icon: HiOutlineShieldCheck,
          },
        ].map((item, idx) => {
          const Icon = item.Icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{item.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" />
              </span>
            </div>
          );
        })}
      </div>

      {/* Branch Breakdown Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-5 bg-muted/20">
          <div>
            <h2 className="text-base font-bold text-foreground">Branch & Location Breakdown</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Employee distribution and status across all company branches.
            </p>
          </div>
          <Link
            href={`/workspace/branches?company_id=${encodeURIComponent(activeWorkspaceId)}`}
            className="text-xs font-bold text-primary hover:underline font-display"
          >
            + Add New Branch
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                <th className="px-6 py-3">Branch Name</th>
                <th className="px-6 py-3">Branch Code</th>
                <th className="px-6 py-3">Address / Location</th>
                <th className="px-6 py-3">Employees</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {companyStats?.branchBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No branches configured yet. The company operates under 1 main location ({companyStats?.totalEmployees ?? 0} employees).
                  </td>
                </tr>
              ) : (
                companyStats?.branchBreakdown.map((branchItem) => (
                  <tr key={branchItem.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <HiOutlineMapPin className="size-4 text-primary" />
                        {branchItem.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {branchItem.code ? (
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                          {branchItem.code}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {branchItem.address || "Main Office / Primary Location"}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {branchItem.employeeCount} employee{branchItem.employeeCount === 1 ? "" : "s"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/workspace/employees?company_id=${encodeURIComponent(activeWorkspaceId)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline font-display"
                      >
                        View Employees
                        <HiOutlineArrowRight className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
              {companyStats && companyStats.unassignedBranchCount > 0 && companyStats.branchBreakdown.length > 0 && (
                <tr className="bg-muted/20">
                  <td className="px-6 py-3 font-semibold text-muted-foreground italic">Unassigned Branch</td>
                  <td className="px-6 py-3 text-muted-foreground">—</td>
                  <td className="px-6 py-3 text-muted-foreground">Unassigned employees</td>
                  <td className="px-6 py-3 font-bold text-foreground">
                    {companyStats.unassignedBranchCount} employee{companyStats.unassignedBranchCount === 1 ? "" : "s"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/workspace/employees?company_id=${encodeURIComponent(activeWorkspaceId)}`}
                      className="text-xs font-bold text-primary hover:underline font-display"
                    >
                      Assign Branch
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
