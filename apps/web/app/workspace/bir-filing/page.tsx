"use client";

import * as React from "react";
import { HiOutlineShieldCheck, HiOutlinePlus, HiOutlineDocumentText } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { useWorkspace } from "../utils/context/workspace-context";

const mockFilings = [
  { period: "Q1 2025", deadline: "Apr 15, 2025", status: "Filed", employees: 42 },
  { period: "Q2 2025", deadline: "Jul 15, 2025", status: "Pending", employees: 44 },
  { period: "Q3 2025", deadline: "Oct 15, 2025", status: "Upcoming", employees: null },
];

const statusColors: Record<string, string> = {
  Filed: "bg-green-500/10 text-green-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Upcoming: "bg-muted text-muted-foreground",
};

export default function BirFilingPage() {
  const { activeWorkspace } = useWorkspace();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            BIR Filing Alphalist
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Quarterly alphalist filings for{" "}
            <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
          </p>
        </div>
        <Button className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          New Filing
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Filings", value: "3", sub: "This year" },
          { label: "Filed", value: "1", sub: "Completed" },
          { label: "Pending", value: "1", sub: "Action needed" },
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

      {/* Filings table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <HiOutlineDocumentText className="size-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Filing History</h2>
        </div>
        <div className="divide-y divide-border">
          {mockFilings.map((f) => (
            <div
              key={f.period}
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{f.period}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Deadline: {f.deadline}</p>
              </div>
              <div className="flex items-center gap-4">
                {f.employees && (
                  <span className="text-sm text-muted-foreground">{f.employees} employees</span>
                )}
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[f.status]}`}
                >
                  {f.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
