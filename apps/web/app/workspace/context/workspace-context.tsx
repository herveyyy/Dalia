"use client";

import * as React from "react";
import { WorkspaceContextType } from "../types/workspace.types";

export const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export function useWorkspace() {
  const ctx = React.useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}
