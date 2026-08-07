"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineTag,
} from "react-icons/hi2";

interface ActivityLogTableProps {
  initialLogs: ActivityLogItem[];
  totalCount: number;
  page?: number;
  itemsPerPage?: number;
}

export function ActivityLogTable({
  initialLogs,
  totalCount,
  page = 1,
  itemsPerPage = 20,
}: ActivityLogTableProps) {
  const router = useRouter();
  const [logs] = useState<ActivityLogItem[]>(initialLogs);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");

  // Filter logs based on search query, action, and entity type
  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    const matchesEntity =
      entityFilter === "ALL" ||
      log.entityType.toLowerCase() === entityFilter.toLowerCase();
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      log.summary?.toLowerCase().includes(searchLower) ||
      log.entityType.toLowerCase().includes(searchLower) ||
      log.entityId.toLowerCase().includes(searchLower) ||
      log.actorName?.toLowerCase().includes(searchLower) ||
      log.actorEmail?.toLowerCase().includes(searchLower);

    return matchesAction && matchesEntity && matchesSearch;
  });

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
    <div className="space-y-6">
      {/* Header Bar */}
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
          <span className="font-bold text-foreground">{filteredLogs.length}</span> of{" "}
          <span className="font-bold text-foreground">{totalCount}</span> total entries
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-xl bg-card border border-border/60 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input using Atomic Input Component */}
        <div className="sm:col-span-6 relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by keyword, actor, summary, entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Action Select */}
        <div className="sm:col-span-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full h-10 px-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
          >
            <option value="ALL">All Action Types</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="ARCHIVE">ARCHIVE / DELETE</option>
            <option value="RESTORE">RESTORE</option>
          </select>
        </div>

        {/* Entity Select */}
        <div className="sm:col-span-3">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full h-10 px-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-colors"
          >
            <option value="ALL">All Entity Types</option>
            <option value="employee">Employee</option>
            <option value="department">Department</option>
            <option value="branch">Branch</option>
            <option value="company">Company</option>
            <option value="role">Role</option>
          </select>
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
            {filteredLogs.length === 0 ? (
              <TableEmpty colSpan={6}>
                No activity logs match your search criteria.
              </TableEmpty>
            ) : (
              filteredLogs.map((log) => (
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
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <HiOutlineTag className="size-3.5 text-primary" />
                      <span className="font-bold text-foreground capitalize">
                        {log.entityType}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground max-w-[100px] truncate">
                        ({log.entityId})
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
