"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ViewToggleProps {
  currentView?: "grid" | "rows";
  onViewChange?: (view: "grid" | "rows") => void;
}

export function ViewToggle({ currentView = "grid", onViewChange }: ViewToggleProps) {
  const setView = (view: "grid" | "rows") => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("dalia:filter:view", view);
      } catch (e) {}
    }
    if (onViewChange) {
      onViewChange(view);
    } else if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      window.location.href = url.toString();
    }
  };

  return (
    <div className="flex items-center rounded-lg border border-input bg-card p-1">
      <button
        type="button"
        onClick={() => setView("grid")}
        className={cn(
          "flex items-center justify-center rounded-md p-1.5 text-xs font-medium transition-colors cursor-pointer",
          currentView === "grid"
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
          currentView === "rows"
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
