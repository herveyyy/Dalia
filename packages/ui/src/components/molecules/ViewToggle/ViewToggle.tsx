"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ViewToggleProps {
  currentView?: "grid" | "rows" | null;
  onViewChange?: (view: "grid" | "rows") => void;
}

function getSnapshot(): "grid" | "rows" | null {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem("employee_table_hris");
    if (val === "row") return "rows";
    if (val === "column") return "grid";
  } catch (e) {}
  return null;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const storedView = React.useSyncExternalStore(subscribe, getSnapshot, () => null);
  const activeView = currentView !== undefined ? currentView : storedView;

  const setView = (view: "grid" | "rows") => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("employee_table_hris", view === "grid" ? "column" : "row");
        window.dispatchEvent(new Event("storage"));
      } catch (e) {}
    }
    if (onViewChange) {
      onViewChange(view);
    }
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
