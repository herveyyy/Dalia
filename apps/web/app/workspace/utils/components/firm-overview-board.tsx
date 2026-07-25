import * as React from "react";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiPlus,
  HiOutlineFolderOpen,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { Workspace } from "../types/workspace.types";
import { FirmStats } from "../types/dashboard.types";

interface FirmOverviewBoardProps {
  clientWorkspaces: Workspace[];
  firmStats: FirmStats | null;
  openCreateDialog: () => void;
  onSelectWorkspace: (id: string) => void;
}

export function FirmOverviewBoard({
  clientWorkspaces,
  firmStats,
  openCreateDialog,
  onSelectWorkspace,
}: FirmOverviewBoardProps) {
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
