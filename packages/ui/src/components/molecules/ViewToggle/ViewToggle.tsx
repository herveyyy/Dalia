"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "../../../lib/utils";

export type TableViewMode = "grid" | "rows";

export interface ViewToggleProps {
  /** localStorage key for this table’s view preference */
  storageKey?: string;
  /** Controlled highlight; omit to read directly from localStorage */
  currentView?: TableViewMode | null;
  onViewChange?: (view: TableViewMode) => void;
}

const DEFAULT_STORAGE_KEY = "employee_table_hris";

function readStoredView(storageKey: string): TableViewMode | null {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(storageKey);
    if (val === "row") return "rows";
    if (val === "column") return "grid";
  } catch {
    /* ignore */
  }
  return null;
}

function writeStoredView(storageKey: string, view: TableViewMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, view === "grid" ? "column" : "row");
    // storage event is cross-tab only; this covers same-tab listeners
    window.dispatchEvent(new CustomEvent("dalia:view-toggle", { detail: { key: storageKey } }));
  } catch {
    /* ignore */
  }
}

function subscribeToView(storageKey: string, callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === storageKey || e.key === null) callback();
  };
  const onLocal = (e: Event) => {
    const detail = (e as CustomEvent<{ key: string }>).detail;
    if (!detail?.key || detail.key === storageKey) callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("dalia:view-toggle", onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("dalia:view-toggle", onLocal);
  };
}

export function ViewToggle({
  storageKey = DEFAULT_STORAGE_KEY,
  currentView,
  onViewChange,
}: ViewToggleProps) {
  const storedView = React.useSyncExternalStore(
    (cb) => subscribeToView(storageKey, cb),
    () => readStoredView(storageKey),
    () => null
  );

  const isControlled = currentView !== undefined;
  const activeView = isControlled ? currentView : storedView;

  const setView = (view: TableViewMode) => {
    writeStoredView(storageKey, view);
    onViewChange?.(view);
  };

  return (
    <div className="flex items-center rounded-lg border border-input bg-card p-1">
      <button
        type="button"
        onClick={() => setView("grid")}
        className={cn(
          "flex items-center justify-center rounded-md p-1.5 text-xs font-medium transition-colors cursor-pointer",
          activeView === "grid"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Grid View"
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setView("rows")}
        className={cn(
          "flex items-center justify-center rounded-md p-1.5 text-xs font-medium transition-colors cursor-pointer",
          activeView === "rows"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Compact / Row View"
      >
        <List className="size-4" />
      </button>
    </div>
  );
}

/** Read a table view from localStorage (client only). */
export function readTableView(storageKey: string): TableViewMode | null {
  return readStoredView(storageKey);
}

/** Persist a table view to localStorage. */
export function writeTableView(storageKey: string, view: TableViewMode) {
  writeStoredView(storageKey, view);
}
