"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ActivityLogItem, DiffViewerModal } from "./diff-viewer-modal";
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@repo/ui/components/atoms/Table";
import { Input } from "@repo/ui/components/atoms/Input";
import { Button } from "@repo/ui/components/atoms/Button";
import { Badge } from "@repo/ui/components/atoms/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/atoms/Select";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineXMark,
  HiOutlineArrowPath,
} from "react-icons/hi2";

export interface ActivityLogTableProps {
  initialLogs: ActivityLogItem[];
  totalCount: number;
  page?: number;
  itemsPerPage?: number;
  search?: string;
  actionFilter?: string;
  entityFilter?: string;
  showHeader?: boolean;
}

export function ActivityLogTable({
  initialLogs,
  totalCount,
  page = 1,
  itemsPerPage = 20,
  search: initialSearch = "",
  actionFilter: initialActionFilter = "ALL",
  entityFilter: initialEntityFilter = "ALL",
  showHeader = true,
}: ActivityLogTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  const [search, setSearch] = useState(initialSearch);
  const [actionFilter, setActionFilter] = useState(initialActionFilter);
  const [entityFilter, setEntityFilter] = useState(initialEntityFilter);

  const updateQueryParams = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "ALL") {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ q: search });
  };

  const handleActionChange = (val: string) => {
    setActionFilter(val);
    updateQueryParams({ action: val });
  };

  const handleEntityChange = (val: string) => {
    setEntityFilter(val);
    updateQueryParams({ entity: val });
  };

  const handleResetFilters = () => {
    setSearch("");
    setActionFilter("ALL");
    setEntityFilter("ALL");
    updateQueryParams({ q: "", action: "ALL", entity: "ALL" });
  };

  const hasActiveFilters = Boolean(search || actionFilter !== "ALL" || entityFilter !== "ALL");

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "warning";
      case "DELETE":
      case "ARCHIVE":
        return "destructive";
      case "RESTORE":
        return "info";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Optional Header Bar */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <HiOutlineDocumentText className="size-8 text-primary" />
              System Activity Log & Audit Trail
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete version-controlled audit records of all system actions, updates, and amendments.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-xl px-4 py-2 self-start shadow-xs font-medium">
            <span className="font-bold text-foreground">{initialLogs.length}</span> of{" "}
            <span className="font-bold text-foreground">{totalCount}</span> total entries
          </div>
        </div>
      )}

      {/* Sleek Horizontal Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60 shadow-xs">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by keyword, actor, summary, entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 text-xs h-9 bg-background/50 border-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateQueryParams({ q: "" });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <HiOutlineXMark className="size-3.5" />
            </button>
          )}
        </form>

        {/* Inline Filters & Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter — Radix Select */}
          <Select value={actionFilter} onValueChange={handleActionChange}>
            <SelectTrigger size="xs" className="w-auto min-w-[148px]">
              <SelectValue placeholder="All Action Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Action Types</SelectItem>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="ARCHIVE">ARCHIVE / DELETE</SelectItem>
              <SelectItem value="RESTORE">RESTORE</SelectItem>
            </SelectContent>
          </Select>

          {/* Entity Filter — Radix Select */}
          <Select value={entityFilter} onValueChange={handleEntityChange}>
            <SelectTrigger size="xs" className="w-auto min-w-[148px]">
              <SelectValue placeholder="All Entity Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Entity Types</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="branch">Branch</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="tax_type">Tax Setting</SelectItem>
              <SelectItem value="job_posting">Job Posting</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleResetFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <HiOutlineArrowPath className="size-3.5" />
              Reset
            </Button>
          )}

          {/* Counter Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 border border-border/40 rounded-lg px-2.5 py-1.5 font-medium">
            <span className="font-semibold text-foreground">{initialLogs.length}</span> / {totalCount}
          </div>
        </div>
      </div>

      {/* Atomic Table Component */}
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLogs.length === 0 ? (
              <TableEmpty colSpan={6}>
                No activity logs match your search criteria.
              </TableEmpty>
            ) : (
              initialLogs.map((log) => (
                <TableRow key={log.id}>
                  {/* Timestamp */}
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <HiOutlineCalendar className="size-3.5 text-muted-foreground/70" />
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </div>
                  </TableCell>

                  {/* Actor */}
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                        {(log.actorName?.[0] || log.actorEmail?.[0] || "S").toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-xs">
                          {log.actorName || log.actorEmail || "System"}
                        </div>
                        {log.actorEmail && log.actorName && (
                          <div className="text-[10px] text-muted-foreground">
                            {log.actorEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Action Badge */}
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>

                  {/* Target Entity */}
                  <TableCell className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs min-w-0">
                      <HiOutlineTag className="size-3.5 text-primary shrink-0" />
                      <span className="font-bold text-foreground capitalize shrink-0">
                        {log.entityType}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[80px]">
                        {log.entityId.slice(0, 8)}…
                      </span>
                    </div>
                  </TableCell>

                  {/* Summary */}
                  <TableCell className="text-foreground/90 max-w-xs truncate text-xs">
                    {log.summary || `${log.action} on ${log.entityType}`}
                  </TableCell>

                  {/* Actions Button */}
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedLog(log)}
                      className="gap-1 font-semibold"
                    >
                      <HiOutlineEye className="size-3.5" />
                      View Diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Molecule */}
      <DataPagination
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        navigate={(href) => router.push(href, { scroll: false })}
      />

      {/* Modal Inspector */}
      <DiffViewerModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
