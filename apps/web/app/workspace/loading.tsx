import * as React from "react";

export default function WorkspaceLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-lg bg-muted/60" />
          <div className="h-4 w-96 rounded bg-muted/40" />
        </div>
        <div className="h-10 w-44 rounded-lg bg-muted/60" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-muted/50" />
              <div className="h-7 w-16 rounded bg-muted/70" />
              <div className="h-3 w-32 rounded bg-muted/30" />
            </div>
            <div className="size-12 rounded-xl bg-muted/40" />
          </div>
        ))}
      </div>

      {/* Table Section Skeleton */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/20 px-6 py-5">
          <div className="h-5 w-48 rounded bg-muted/60" />
          <div className="mt-1 h-3 w-80 rounded bg-muted/40" />
        </div>
        <div className="divide-y divide-border p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="space-y-1.5">
                <div className="h-4 w-40 rounded bg-muted/60" />
                <div className="h-3 w-28 rounded bg-muted/30" />
              </div>
              <div className="h-6 w-20 rounded bg-muted/40" />
              <div className="h-4 w-24 rounded bg-muted/50" />
              <div className="h-8 w-28 rounded-lg bg-muted/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
