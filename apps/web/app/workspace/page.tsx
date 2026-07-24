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
} from "react-icons/hi2";
import { useWorkspace } from "./utils/context/workspace-context";

export default function WorkspacePage() {
  const { activeWorkspace, isFirmWorkspace, workspaces, onSelectWorkspace, openCreateDialog } = useWorkspace();

  // Filter client workspaces (exclude the firm workspace itself)
  const clientWorkspaces = React.useMemo(
    () => workspaces.filter((w) => !w.isFirm),
    [workspaces]
  );

  // Mock compliance data matched to workspaces
  const complianceData = React.useMemo(() => {
    return {
      "2": { bir: "Pending", sss: "Remitted", nextDue: "Apr 15, 2025" },
      "3": { bir: "Filed", sss: "Pending", nextDue: "Mar 30, 2025" },
    };
  }, []);

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
              Firm Compliance Board
            </h1>
            <p className="mt-1.5 text-base text-muted-foreground">
              Central control panel for managing all client entities.
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
            { label: "Total Clients", value: clientWorkspaces.length, sub: "Active companies", Icon: HiOutlineFolderOpen },
            { label: "Pending Filings", value: "1", sub: "Action required", Icon: HiOutlineShieldCheck },
            { label: "Overdue Remittances", value: "1", sub: "Alerts active", Icon: HiOutlineClock },
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

        {/* Compliance Tracker Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-5 bg-muted/20">
            <div>
              <h2 className="text-base font-bold text-foreground">Client Compliance Status</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time status of statutory filing obligations.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <th className="px-6 py-3">Client Company</th>
                  <th className="px-6 py-3">BIR Alphalist</th>
                  <th className="px-6 py-3">SSS/HDMF</th>
                  <th className="px-6 py-3">Next Deadline</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {clientWorkspaces.map((client) => {
                  const compliance = complianceData[client.id as keyof typeof complianceData] || {
                    bir: "Pending",
                    sss: "Pending",
                    nextDue: "—",
                  };

                  return (
                    <tr key={client.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{client.adminEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                            statusColors[compliance.bir] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {compliance.bir}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                            statusColors[compliance.sss] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {compliance.sss}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-muted-foreground">
                        {compliance.nextDue}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectWorkspace(client.id)}
                          className="gap-1.5 hover:bg-primary/10 hover:text-primary"
                        >
                          Manage Workspace
                          <HiOutlineArrowRight className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Client Workspace Dashboard view
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            {activeWorkspace?.name}
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Client Workspace Overview & Configuration
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/60 bg-card p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HiOutlineHome className="size-5" />
            </span>
            <CardTitle className="text-lg font-bold mt-3">Workspace Identity</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              General company properties and workspace indicators.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-sm space-y-2 mt-4 pt-4 border-t border-border/40">
            <div>
              <span className="text-muted-foreground font-semibold">Workspace Name:</span>
              <span className="ml-2 font-bold text-foreground">{activeWorkspace?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Workspace ID:</span>
              <span className="ml-2 font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">
                {activeWorkspace?.id}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <HiOutlineEnvelopeOpen className="size-5" />
            </span>
            <CardTitle className="text-lg font-bold mt-3">Company Admin</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Admin employee created for this client (from workspace setup email).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-sm space-y-2 mt-4 pt-4 border-t border-border/40">
            <div>
              <span className="text-muted-foreground font-semibold">Designated Admin:</span>
              <span className="ml-2 font-bold text-foreground">
                {activeWorkspace?.adminEmail || "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Access Privilege:</span>
              <span
                className={`ml-2 rounded px-2 py-0.5 text-xs font-bold uppercase ${
                  activeWorkspace?.adminHasLogin
                    ? "bg-green-500/10 text-green-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {activeWorkspace?.adminHasLogin ? "Login enabled" : "In directory"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {activeWorkspace?.adminHasLogin
                ? "This admin can sign in at /login and only sees this company’s workspace."
                : "Employee is in People → Employees. Use Login there so they can open this workspace."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
