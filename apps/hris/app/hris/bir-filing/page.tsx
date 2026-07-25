"use client";

import * as React from "react";
import { useState } from "react";
import { HiOutlineShieldCheck, HiOutlineDocumentText, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";

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

export default function HrisBirFilingPage() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("grid");

  const totalItems = mockFilings.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = mockFilings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            BIR Filing Alphalist
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Annual and quarterly BIR tax alphalist filings for your company.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <Button className="font-display gap-2">
            <HiOutlinePlus className="size-4" />
            Generate New Alphalist
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-3">
          {paginatedData.map((filing, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HiOutlineShieldCheck className="size-5" />
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusColors[filing.status]
                    }`}
                  >
                    {filing.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {filing.period}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Deadline: {filing.deadline}
                  </p>
                </div>

                {filing.employees && (
                  <p className="text-xs font-medium text-foreground">
                    {filing.employees} employees included
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer">
                  <HiOutlineDocumentText className="size-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden divide-y">
          {paginatedData.map((filing, idx) => (
            <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30">
              <div className="flex items-center gap-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineShieldCheck className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{filing.period}</h3>
                  <p className="text-xs text-muted-foreground">Deadline: {filing.deadline}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    statusColors[filing.status]
                  }`}
                >
                  {filing.status}
                </span>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer">
                  <HiOutlineDocumentText className="size-4" />
                  View Details
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
