"use client";

import * as React from "react";
import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineEnvelope } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";

const mockPartners = [
  {
    name: "Alicia Reyes",
    role: "Managing Partner",
    email: "alicia@dalia.ph",
    clients: 12,
    status: "Active",
  },
  {
    name: "Marco Santos",
    role: "Senior Associate",
    email: "marco@dalia.ph",
    clients: 8,
    status: "Active",
  },
  {
    name: "Joanna Cruz",
    role: "Associate",
    email: "joanna@dalia.ph",
    clients: 5,
    status: "On Leave",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-500/10 text-green-600",
  "On Leave": "bg-amber-500/10 text-amber-600",
};

export default function PartnersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Manage Partners
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Firm partners, associates, and staff assignments.
          </p>
        </div>
        <Button className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Invite Partner
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Partners", value: "3", sub: "Firm members" },
          { label: "Active", value: "2", sub: "Currently working" },
          { label: "Total Clients", value: "25", sub: "Across all partners" },
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

      {/* Partner list */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <HiOutlineUserGroup className="size-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Team Members</h2>
        </div>
        <div className="divide-y divide-border">
          {mockPartners.map((p) => (
            <div
              key={p.email}
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HiOutlineEnvelope className="size-3.5" />
                  {p.email}
                </div>
                <span className="text-xs text-muted-foreground">{p.clients} clients</span>
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[p.status]}`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
