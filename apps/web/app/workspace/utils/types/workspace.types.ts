export interface Workspace {
  id: string;
  name: string;
  adminEmail: string;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeWorkspace?: Workspace;
  onSelectWorkspace: (id: string) => void;
  openCreateDialog: () => void;
}
