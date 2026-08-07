"use client";

import React, { useState } from "react";
import { ActivityLogItem, DiffViewerModal } from "./diff-viewer-modal";
import { HiOutlineClock, HiOutlineEye, HiOutlineUser } from "react-icons/hi2";

interface EntityHistoryTabProps {
  logs: ActivityLogItem[];
  entityName?: string;
}

export function EntityHistoryTab({ logs, entityName }: EntityHistoryTabProps) {
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  const actionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      case "UPDATE":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "DELETE":
      case "ARCHIVE":
        return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
      case "RESTORE":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <HiOutlineClock className="w-4 h-4 text-primary" />
          Audit & Version History {entityName ? `for ${entityName}` : ""}
        </h3>
        <span className="text-xs text-muted-foreground">
          {logs.length} revision{logs.length === 1 ? "" : "s"} recorded
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-xs bg-muted/40 rounded-xl border border-border">
          No recorded activity or audit logs found for this entity.
        </div>
      ) : (
        <div className="relative border-l border-border ml-3 pl-6 space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute left-[-31px] top-1 w-3 h-3 rounded-full bg-card border-2 border-primary group-hover:bg-primary transition-colors" />

              <div className="bg-card border border-border rounded-xl p-4 space-y-2 hover:border-primary/40 transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${actionBadge(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedLog(log)}
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary-foreground hover:bg-primary px-2 py-1 rounded-md transition-all font-semibold cursor-pointer"
                  >
                    <HiOutlineEye className="w-3.5 h-3.5" />
                    Inspect Diff
                  </button>
                </div>

                <p className="text-xs text-foreground font-medium">
                  {log.summary || `${log.action} operation on ${log.entityType}`}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <HiOutlineUser className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Modified by:</span>
                  <span className="text-foreground font-semibold">
                    {log.actorName || log.actorEmail || "System"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diff Inspector Modal */}
      <DiffViewerModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
