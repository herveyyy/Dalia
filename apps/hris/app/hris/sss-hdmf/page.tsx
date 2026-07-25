"use client";

import * as React from "react";
import { useState } from "react";
import { HiOutlineClock, HiOutlineDocumentText, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";

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

export default function HrisSssHdmfPage() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("grid");

  const totalItems = mockContributions.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = mockContributions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            SSS/HDMF Contributions
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Monthly SSS and HDMF statutory contribution records for your company.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <Button className="font-display gap-2">
            <HiOutlinePlus className="size-4" />
            File Contribution R-1A
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HiOutlineClock className="size-5" />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {item.month}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>SSS Total: <strong className="text-foreground">{item.sss}</strong></p>
                    <p>Pag-IBIG Total: <strong className="text-foreground">{item.hdmf}</strong></p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                <button className="flex items-center gap-1 font-semibold text-primary hover:underline">
                  <HiOutlineDocumentText className="size-4" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border/60">
          {paginatedData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30">
              <div className="flex items-center gap-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineClock className="size-5" />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">{item.month}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    SSS: {item.sss} · Pag-IBIG: {item.hdmf}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColors[item.status]}`}>
                  {item.status}
                </span>
                <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  <HiOutlineDocumentText className="size-4" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataPagination
        totalItems={totalItems}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={(newItems) => {
          setItemsPerPage(newItems);
          setPage(1);
        }}
      />
    </div>
  );
}
