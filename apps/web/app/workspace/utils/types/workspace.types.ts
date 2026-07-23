import { workspace } from "@repo/db";

export interface Workspace {
  id: string;
  name: string;
  adminEmail: string;
  isFirm?: boolean;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace?: Workspace;
  isFirmWorkspace: boolean;
  onSelectWorkspace: (id: string) => void;
  openCreateDialog: () => void;
}
export type WorkspaceInsert = typeof workspace.$inferInsert;
export type WorkspaceSelect = typeof workspace.$inferSelect;
