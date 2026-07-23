"use client";

import * as React from "react";
import { HiOutlineClock, HiOutlinePlus, HiOutlineDocumentText } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { useWorkspace } from "../utils/context/workspace-context";

const mockContributions = [
  { month: "January 2025", sss: "₱12,400", hdmf: "₱3,200", status: "Remitted" },
  { month: "February 2025", sss: "₱12,400", hdmf: "₱3,200", status: "Remitted" },
  { month: "March 2025", sss: "₱12,950", hdmf: "₱3,350", status: "Pending" },
  { month: "April 2025", sss: "—", hdmf: "—", status: "Upcoming" },
];

const statusColors: Record<string, string> = {
  Remitted: "bg-green-500/10 text-green-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Upcoming: "bg-muted text-muted-foreground",
};

export default function SssHdmfPage() {
  const { activeWorkspace } = useWorkspace();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            SSS/HDMF Contributions
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Monthly remittances for{" "}
            <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
          </p>
        </div>
        <Button className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Record Remittance
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "SSS YTD", value: "₱37,750", sub: "Jan – Mar 2025" },
          { label: "HDMF YTD", value: "₱9,750", sub: "Jan – Mar 2025" },
          { label: "Pending", value: "1 month", sub: "March 2025" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <HiOutlineDocumentText className="size-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Remittance Records</h2>
        </div>
        <div className="divide-y divide-border">
          {mockContributions.map((c) => (
            <div
              key={c.month}
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
            >
              <p className="text-sm font-bold text-foreground">{c.month}</p>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">SSS</p>
                  <p className="text-sm font-semibold text-foreground">{c.sss}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">HDMF</p>
                  <p className="text-sm font-semibold text-foreground">{c.hdmf}</p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[c.status]}`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
