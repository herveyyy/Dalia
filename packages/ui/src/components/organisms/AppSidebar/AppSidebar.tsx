import * as React from "react";
import { SidebarItem } from "../../atoms/SidebarItem";
import { Workspace, WorkspaceSelector } from "../../molecules/WorkspaceSelector";
import { LogOut } from "lucide-react";

export interface SidebarNavGroup {
  title?: string;
  items: {
    label: string;
    href: string;
    Icon?: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
    badge?: string | number;
  }[];
}

export interface AppSidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspaceClick: () => void;
  navGroups: SidebarNavGroup[];
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogoutClick?: () => void;
}

export function AppSidebar({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspaceClick,
  navGroups,
  user,
  onLogoutClick,
}: AppSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-card px-4 py-6 shadow-sm">
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <span className="font-display text-2xl font-bold tracking-tight text-primary">
          Dalia
        </span>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-display text-[10px] font-bold tracking-[0.5px] text-primary uppercase">
          Firm
        </span>
      </div>

      <div className="px-1">
        <WorkspaceSelector
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSelectWorkspace={onSelectWorkspace}
          onCreateWorkspaceClick={onCreateWorkspaceClick}
        />
      </div>

      <nav className="flex-1 space-y-7 mt-8 overflow-y-auto px-1">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {group.title && (
              <h3 className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {group.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, itemIdx) => (
                <SidebarItem
                  key={itemIdx}
                  label={item.label}
                  href={item.href}
                  Icon={item.Icon}
                  isActive={item.isActive}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border pt-4 mt-auto px-1">
        <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="size-8 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-foreground">
                {user.name}
              </div>
              <div className="truncate text-xs font-medium text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
          {onLogoutClick && (
            <button
              onClick={onLogoutClick}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer outline-none"
              title="Log out"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
