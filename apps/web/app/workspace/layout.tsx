import * as React from "react";
import { WorkspaceShell } from "./utils/components/workspace-shell";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
