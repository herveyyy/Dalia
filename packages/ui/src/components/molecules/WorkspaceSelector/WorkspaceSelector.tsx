import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

export interface Workspace {
  id: string;
  name: string;
  adminEmail: string;
}

export interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspaceClick: () => void;
}

export function WorkspaceSelector({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspaceClick,
}: WorkspaceSelectorProps) {
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  return (
    <Menu.Root>
      <Menu.Trigger className="flex w-full items-center justify-between rounded-2xl border border-border/85 bg-card px-4 py-3 text-left shadow-sm hover:bg-muted/40 transition-colors outline-none cursor-pointer">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Building2 className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-foreground">
              {activeWorkspace?.name || "Select Workspace"}
            </div>
            <div className="truncate text-xs font-semibold text-muted-foreground">
              {activeWorkspace?.adminEmail || "No admin assigned"}
            </div>
          </div>
        </div>
        <ChevronsUpDown className="size-4 text-muted-foreground shrink-0 ml-2" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="start" sideOffset={6} className="z-50">
          <Menu.Popup className="w-[var(--anchor-width)] min-w-[240px] rounded-2xl border border-border bg-card p-2.5 shadow-xl outline-none focus:outline-none">
            <div className="px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Workspaces
            </div>
            <div className="my-1.5 max-h-[220px] overflow-y-auto space-y-0.5">
              {workspaces.map((ws) => (
                <Menu.Item
                  key={ws.id}
                  onClick={() => onSelectWorkspace(ws.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors outline-none select-none cursor-pointer",
                    ws.id === activeWorkspaceId
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{ws.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{ws.adminEmail}</div>
                  </div>
                </Menu.Item>
              ))}
            </div>

            <Menu.Separator className="h-px bg-border my-2" />

            <Menu.Item
              onClick={() => onCreateWorkspaceClick()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 outline-none select-none cursor-pointer"
            >
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Plus className="size-4" />
              </div>
              <span className="font-bold">Create Workspace</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
