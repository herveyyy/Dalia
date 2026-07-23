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
      <Menu.Trigger className="flex w-full items-center justify-between rounded-xl border border-border/85 bg-card px-3.5 py-2.5 text-left shadow-sm hover:bg-muted/40 transition-colors outline-none cursor-pointer">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-foreground">
              {activeWorkspace?.name || "Select Workspace"}
            </div>
            <div className="truncate text-xs font-medium text-muted-foreground">
              {activeWorkspace?.adminEmail || "No admin assigned"}
            </div>
          </div>
        </div>
        <ChevronsUpDown className="size-4 text-muted-foreground shrink-0 ml-2" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="start" sideOffset={6} className="z-50">
          <Menu.Popup className="w-[var(--anchor-width)] min-w-[240px] rounded-xl border border-border bg-card p-1.5 shadow-xl outline-none focus:outline-none">
            <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Workspaces
            </div>
            <div className="my-1 max-h-[220px] overflow-y-auto space-y-0.5">
              {workspaces.map((ws) => (
                <Menu.Item
                  key={ws.id}
                  onClick={() => onSelectWorkspace(ws.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors outline-none select-none cursor-pointer",
                    ws.id === activeWorkspaceId
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
                    <Building2 className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-xs">{ws.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground font-normal">{ws.adminEmail}</div>
                  </div>
                </Menu.Item>
              ))}
            </div>

            <Menu.Separator className="h-px bg-border my-1.5" />

            <Menu.Item
              onClick={() => onCreateWorkspaceClick()}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-primary hover:bg-primary/5 outline-none select-none cursor-pointer"
            >
              <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <Plus className="size-3.5" />
              </div>
              <span className="font-bold">Create Workspace</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
