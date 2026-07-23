"use client";

import * as React from "react";
import { HiOutlineFolderOpen, HiOutlineMagnifyingGlass, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { useWorkspace } from "../utils/context/workspace-context";

export default function ClientsPage() {
  const { activeWorkspace } = useWorkspace();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Client Database
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            All clients under{" "}
            <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
          </p>
        </div>
        <Button className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Add Client
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients..."
          className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-colors"
        />
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-4">
          <HiOutlineFolderOpen className="size-7" />
        </div>
        <h3 className="text-base font-bold text-foreground">No clients yet</h3>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
          Add your first client to start managing their compliance and filings.
        </p>
        <Button className="mt-6 gap-2" variant="outline">
          <HiOutlinePlus className="size-4" />
          Add Client
        </Button>
      </div>
    </div>
  );
}
