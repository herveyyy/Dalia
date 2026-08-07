"use client";

import React, { useState } from "react";
import {
  HiOutlineXMark,
  HiOutlineCodeBracket,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

export interface ActivityLogItem {
  id: string;
  companyId?: string | null;
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  summary?: string | null;
  oldData?: Record<string, any> | null;
  newData?: Record<string, any> | null;
  changes?: Record<string, { old: any; new: any }> | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

interface DiffViewerModalProps {
  log: ActivityLogItem | null;
  onClose: () => void;
}

export function DiffViewerModal({ log, onClose }: DiffViewerModalProps) {
  const [viewMode, setViewMode] = useState<"diff" | "raw">("diff");

  if (!log) return null;

  const actionColorMap: Record<string, { bg: string; text: string; border: string }> = {
    CREATE: { bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500/30" },
    UPDATE: { bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/30" },
    DELETE: { bg: "bg-rose-500/15", text: "text-rose-700 dark:text-rose-400", border: "border-rose-500/30" },
    ARCHIVE: { bg: "bg-rose-500/15", text: "text-rose-700 dark:text-rose-400", border: "border-rose-500/30" },
    RESTORE: { bg: "bg-blue-500/15", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/30" },
  };

  const actionStyle = actionColorMap[log.action] || {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  };

  const changesObj = log.changes || {};
  const changeKeys = Object.keys(changesObj);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl text-foreground overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border ${actionStyle.bg} ${actionStyle.text} ${actionStyle.border}`}
            >
              {log.action}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground capitalize">
                {log.entityType} Audit Record
              </h3>
              <p className="text-xs text-muted-foreground font-mono">ID: {log.entityId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-xl p-1 text-xs font-medium border border-border">
              <button
                onClick={() => setViewMode("diff")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "diff"
                    ? "bg-card text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Field Delta
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === "raw"
                    ? "bg-card text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Full Snapshots
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audit Meta Bar */}
        <div className="px-6 py-3 bg-muted/50 border-b border-border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <HiOutlineUser className="w-4 h-4 text-muted-foreground" />
            <span>Actor: </span>
            <strong className="text-foreground font-semibold">
              {log.actorName || log.actorEmail || log.actorId || "System / Automated"}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineClock className="w-4 h-4 text-muted-foreground" />
            <span>Timestamp: </span>
            <strong className="text-foreground font-semibold">
              {new Date(log.createdAt).toLocaleString()}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineInformationCircle className="w-4 h-4 text-muted-foreground" />
            <span>Summary: </span>
            <strong className="text-foreground font-semibold truncate">
              {log.summary || `${log.action} action performed`}
            </strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {viewMode === "diff" ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Field-Level Delta ({changeKeys.length} field{changeKeys.length === 1 ? "" : "s"} modified)
              </h4>

              {changeKeys.length === 0 ? (
                <div className="p-8 text-center bg-muted/40 rounded-xl border border-border text-muted-foreground text-sm">
                  No explicit field-level changes recorded for this operation.
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden divide-y divide-border bg-background">
                  <div className="grid grid-cols-12 px-4 py-2.5 bg-muted/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                    <div className="col-span-3">Field Name</div>
                    <div className="col-span-4 text-rose-700 dark:text-rose-400">Previous Value (Old)</div>
                    <div className="col-span-5 text-emerald-700 dark:text-emerald-400">New Value (Updated)</div>
                  </div>

                  {changeKeys.map((key) => {
                    const diff = changesObj[key];
                    const formatVal = (v: any) => {
                      if (v === null || v === undefined) return <span className="italic text-muted-foreground">null</span>;
                      if (typeof v === "object") return JSON.stringify(v);
                      return String(v);
                    };

                    return (
                      <div
                        key={key}
                        className="grid grid-cols-12 px-4 py-3 text-xs items-center hover:bg-muted/30 transition-colors"
                      >
                        <div className="col-span-3 font-mono font-semibold text-primary">
                          {key}
                        </div>
                        <div className="col-span-4 font-mono text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 break-all">
                          {formatVal(diff?.old)}
                        </div>
                        <div className="col-span-5 font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 break-all">
                          {formatVal(diff?.new)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Old Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    Previous State (Before)
                  </h4>
                </div>
                <pre className="p-4 rounded-xl bg-background border border-border text-xs font-mono text-rose-800 dark:text-rose-300 overflow-x-auto max-h-96">
                  {log.oldData
                    ? JSON.stringify(log.oldData, null, 2)
                    : "// No previous record data (New entity created)"}
                </pre>
              </div>

              {/* New Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Updated State (After)
                  </h4>
                </div>
                <pre className="p-4 rounded-xl bg-background border border-border text-xs font-mono text-emerald-800 dark:text-emerald-300 overflow-x-auto max-h-96">
                  {log.newData
                    ? JSON.stringify(log.newData, null, 2)
                    : "// Entity removed/archived"}
                </pre>
              </div>
            </div>
          )}

          {/* Client Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <HiOutlineCodeBracket className="w-4 h-4 text-muted-foreground" />
                Request Metadata
              </h4>
              <div className="bg-background p-3 rounded-xl border border-border text-xs font-mono text-muted-foreground">
                {JSON.stringify(log.metadata, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
