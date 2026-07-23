# Workspace Sidebar & Creation Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a responsive workspace sidebar layout (`AppShell`, `AppSidebar`, `WorkspaceSelector`) and a modal workspace creation dialog (`CreateWorkspaceDialog`) in `@repo/ui`, then integrate it in the `/workspace` route of the `web` application.

**Architecture:** Use a responsive AppShell layout wrapping AppSidebar and main page content. Implement dropdown-based workspace switching and modal-based workspace creation using `@base-ui/react` Accessible Primitives (Dialog, Menu).

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, `@base-ui/react`, React Icons (`react-icons/hi2`).

## Global Constraints
- Naming conventions: Use PascalCase for React components, kebab-case for folders.
- Follow atomic structure: Atoms (primitives), Molecules (selector/modal), Organisms (sidebar/shell).
- Use subpath exports in `@repo/ui` using wildcard configurations.
- Verify each task by running typechecking: `bun run check-types` inside `packages/ui` and `apps/web`.

---

### Task 1: Dialog Primitives (Atoms)

**Files:**
- Create: `packages/ui/src/components/atoms/Dialog/Dialog.tsx`
- Create: `packages/ui/src/components/atoms/Dialog/index.ts`

**Interfaces:**
- Consumes: `@base-ui/react/dialog`
- Produces: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose` components.

- [ ] **Step 1: Write implementation for `Dialog.tsx`**

Create `packages/ui/src/components/atoms/Dialog/Dialog.tsx` with:
```tsx
import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@repo/ui/lib/utils";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogPortal = BaseDialog.Portal;

export function DialogOverlay({ className, ...props }: React.ComponentProps<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Popup
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-8 shadow-2xl transition-all duration-300 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={cn("text-2xl font-bold text-foreground font-display", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={cn("mt-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export const DialogClose = BaseDialog.Close;
```

- [ ] **Step 2: Create entrypoint `index.ts`**

Create `packages/ui/src/components/atoms/Dialog/index.ts` with:
```typescript
export * from "./Dialog";
```

- [ ] **Step 3: Verify build and typechecking**

Run: `bun run check-types` in `packages/ui`
Expected: Exits successfully (code 0) without type errors.

- [ ] **Step 4: Commit**
```bash
git add packages/ui/src/components/atoms/Dialog
git commit -m "feat(ui): add accessible Dialog atoms"
```

---

### Task 2: SidebarItem (Atoms)

**Files:**
- Create: `packages/ui/src/components/atoms/SidebarItem/SidebarItem.tsx`
- Create: `packages/ui/src/components/atoms/SidebarItem/index.ts`

**Interfaces:**
- Produces: `SidebarItem` component with type `SidebarItemProps`.

- [ ] **Step 1: Write implementation for `SidebarItem.tsx`**

Create `packages/ui/src/components/atoms/SidebarItem/SidebarItem.tsx` with:
```tsx
import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

export interface SidebarItemProps extends React.ComponentProps<"a"> {
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
}

export function SidebarItem({
  className,
  label,
  Icon,
  isActive,
  badge,
  ...props
}: SidebarItemProps) {
  return (
    <a
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 select-none cursor-pointer",
        isActive
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="flex-1 tracking-wide">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-bold leading-none tracking-wide",
            isActive
              ? "bg-primary-foreground text-primary"
              : "bg-muted-foreground/15 text-muted-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </a>
  );
}
```

- [ ] **Step 2: Create entrypoint `index.ts`**

Create `packages/ui/src/components/atoms/SidebarItem/index.ts` with:
```typescript
export * from "./SidebarItem";
```

- [ ] **Step 3: Verify build and typechecking**

Run: `bun run check-types` in `packages/ui`
Expected: Exits successfully (code 0) without type errors.

- [ ] **Step 4: Commit**
```bash
git add packages/ui/src/components/atoms/SidebarItem
git commit -m "feat(ui): add SidebarItem atom"
```

---

### Task 3: CreateWorkspaceDialog (Molecules)

**Files:**
- Create: `packages/ui/src/components/molecules/CreateWorkspaceDialog/CreateWorkspaceDialog.tsx`
- Create: `packages/ui/src/components/molecules/CreateWorkspaceDialog/index.ts`

**Interfaces:**
- Consumes: `Dialog` atoms, `@repo/ui/components/atoms/Input`, `@repo/ui/components/atoms/Label`, `@repo/ui/components/atoms/Button`
- Produces: `CreateWorkspaceDialog` component with type `CreateWorkspaceDialogProps`.

- [ ] **Step 1: Write implementation for `CreateWorkspaceDialog.tsx`**

Create `packages/ui/src/components/molecules/CreateWorkspaceDialog/CreateWorkspaceDialog.tsx` with:
```tsx
import * as React from "react";
import { HiXMark } from "react-icons/x";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../atoms/Dialog";
import { Button } from "../../atoms/Button";
import { Label } from "../../atoms/Label";
import { Input } from "../../atoms/Input";

export interface CreateWorkspaceDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (data: { name: string; adminEmail: string }) => void;
}

export function CreateWorkspaceDialog({
  trigger,
  open,
  onOpenChange,
  onCreate,
}: CreateWorkspaceDialogProps) {
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName || !adminEmail) return;

    onCreate({ name: workspaceName, adminEmail });
    setWorkspaceName("");
    setAdminEmail("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle>Create Company Workspace</DialogTitle>
            <DialogClose asChild>
              <button className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer outline-none">
                <HiXMark className="size-5" />
              </button>
            </DialogClose>
          </div>
          <DialogDescription>
            Accounting firm partners can configure dedicated workspaces for client companies. Setting up a workspace invites the company administrator (e.g. CEO or Department Head) directly.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Company Name</Label>
              <Input
                id="workspace-name"
                placeholder="e.g. Acme Corporation"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin / CEO Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="e.g. ceo@acme.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Workspace</Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
```

- [ ] **Step 2: Create entrypoint `index.ts`**

Create `packages/ui/src/components/molecules/CreateWorkspaceDialog/index.ts` with:
```typescript
export * from "./CreateWorkspaceDialog";
```

- [ ] **Step 3: Verify build and typechecking**

Run: `bun run check-types` in `packages/ui`
Expected: Exits successfully (code 0) without type errors.

- [ ] **Step 4: Commit**
```bash
git add packages/ui/src/components/molecules/CreateWorkspaceDialog
git commit -m "feat(ui): add CreateWorkspaceDialog molecule"
```

---

### Task 4: WorkspaceSelector (Molecules)

**Files:**
- Create: `packages/ui/src/components/molecules/WorkspaceSelector/WorkspaceSelector.tsx`
- Create: `packages/ui/src/components/molecules/WorkspaceSelector/index.ts`

**Interfaces:**
- Consumes: `@base-ui/react/menu`, `CreateWorkspaceDialog`
- Produces: `WorkspaceSelector` component with type `WorkspaceSelectorProps` and `Workspace` type.

- [ ] **Step 1: Write implementation for `WorkspaceSelector.tsx`**

Create `packages/ui/src/components/molecules/WorkspaceSelector/WorkspaceSelector.tsx` with:
```tsx
import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { HiChevronUpDown, HiPlus, HiBuildingOffice } from "react-icons/hi2";
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
            <HiBuildingOffice className="size-5" />
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
        <HiChevronUpDown className="size-4 text-muted-foreground shrink-0 ml-2" />
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
                    <HiBuildingOffice className="size-4" />
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
                <HiPlus className="size-4" />
              </div>
              <span className="font-bold">Create Workspace</span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
```

- [ ] **Step 2: Create entrypoint `index.ts`**

Create `packages/ui/src/components/molecules/WorkspaceSelector/index.ts` with:
```typescript
export * from "./WorkspaceSelector";
```

- [ ] **Step 3: Verify build and typechecking**

Run: `bun run check-types` in `packages/ui`
Expected: Exits successfully (code 0) without type errors.

- [ ] **Step 4: Commit**
```bash
git add packages/ui/src/components/molecules/WorkspaceSelector
git commit -m "feat(ui): add WorkspaceSelector molecule"
```

---

### Task 5: AppSidebar (Organisms)

**Files:**
- Create: `packages/ui/src/components/organisms/AppSidebar/AppSidebar.tsx`
- Create: `packages/ui/src/components/organisms/AppSidebar/index.ts`

**Interfaces:**
- Consumes: `WorkspaceSelector`, `SidebarItem`
- Produces: `AppSidebar` component with type `AppSidebarProps`.

- [ ] **Step 1: Write implementation for `AppSidebar.tsx`**

Create `packages/ui/src/components/organisms/AppSidebar/AppSidebar.tsx` with:
```tsx
import * as React from "react";
import { SidebarItem } from "../../atoms/SidebarItem";
import { Workspace, WorkspaceSelector } from "../../molecules/WorkspaceSelector";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

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
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-display text-[10px] font-bold tracking-[0.5px] text-primary uppercase">
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
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="size-9 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-foreground">
                {user.name}
              </div>
              <div className="truncate text-xs font-semibold text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
          {onLogoutClick && (
            <button
              onClick={onLogoutClick}
              className="rounded-full p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer outline-none"
              title="Log out"
            >
              <HiOutlineArrowLeftOnRectangle className="size-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create entrypoint `index.ts`**

Create `packages/ui/src/components/organisms/AppSidebar/index.ts` with:
```typescript
export * from "./AppSidebar";
```

- [ ] **Step 3: Verify build and typechecking**

Run: `bun run check-types` in `packages/ui`
Expected: Exits successfully (code 0) without type errors.

- [ ] **Step 4: Commit**
```bash
git add packages/ui/src/components/organisms/AppSidebar
git commit -m "feat(ui): add AppSidebar organism"
```

---

### Task 6: AppShell (Organisms)

**Files:**
- Create: `packages/ui/src/components/organisms/AppShell/AppShell.tsx`
- Create: `packages/ui/src/components/organisms/AppShell/index.ts`

**Interfaces:**
- Consumes: `AppSidebar`, `@base-ui/react/drawer` (or custom drawer styled with Tailwind)
- Produces: `AppShell` component with type `AppShellProps`.

- [ ] **Step 1: Write implementation for `AppShell.tsx`**

Create `packages/ui/src/components/organisms/AppShell/AppShell.tsx` with:
```tsx
import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { AppSidebar, AppSidebarProps } from "../AppSidebar";

export interface AppShellProps extends AppSidebarProps {
  children: React.ReactNode;
}

export function AppShell({ children, ...sidebarProps }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar (Persistent) */}
      <div className="hidden md:flex md:w-[280px] md:flex-col shrink-0">
        <AppSidebar {...sidebarProps} />
      </div>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              Dalia
            </span>
          </div>

          <BaseDrawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <BaseDrawer.Trigger className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer outline-none">
              <HiBars3 className="size-6" />
            </BaseDrawer.Trigger>

            <BaseDrawer.Portal>
              <BaseDrawer.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <BaseDrawer.Popup className="fixed inset-y-0 left-0 z-50 w-full max-w-[300px] bg-card transition-transform duration-300 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-end px-4 pt-4">
                    <BaseDrawer.Close className="rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer outline-none">
                      <HiXMark className="size-6" />
                    </BaseDrawer.Close>
                  </div>
                  <div className="flex-1 overflow-hidden -mt-8">
                    <AppSidebar
                      {...sidebarProps}
                      onSelectWorkspace={(id) => {
                        sidebarProps.onSelectWorkspace(id);
                        setMobileOpen(false);
                      }}
                      onCreateWorkspaceClick={() => {
                        sidebarProps.onCreateWorkspaceClick();
                        setMobileOpen(false);
                      }}
                    />
                  </div>
                </div>
              </BaseDrawer.Popup>
            </BaseDrawer.Portal>
          </BaseDrawer.Root>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create entrypoint `index.ts`**

Create `packages/ui/src/components/organisms/AppShell/index.ts` with:
```typescript
export * from "./AppShell";
```

- [ ] **Step 3: Verify build and typechecking**

Run: `bun run check-types` in `packages/ui`
Expected: Exits successfully (code 0) without type errors.

- [ ] **Step 4: Commit**
```bash
git add packages/ui/src/components/organisms/AppShell
git commit -m "feat(ui): add responsive AppShell organism"
```

---

### Task 7: Workspace Route Integration (`apps/web`)

**Files:**
- Create: `apps/web/app/workspace/page.tsx`
- Delete: `apps/web/workspace/page.tsx` (the incorrectly located file outside `app/`)

**Interfaces:**
- Consumes: `@repo/ui/components/organisms/AppShell`, `CreateWorkspaceDialog`

- [ ] **Step 1: Create the correct page under `app/workspace`**

Create `apps/web/app/workspace/page.tsx` with:
```tsx
"use client";

import * as React from "react";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/molecules/Card";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineFolderOpen,
  HiOutlineEnvelopeOpen,
  HiPlus,
} from "react-icons/hi2";

// Define mock data for workspaces
const initialWorkspaces = [
  { id: "1", name: "Dalia Firm (Internal)", adminEmail: "partner@dalia.ph" },
  { id: "2", name: "Acme Logistics Inc.", adminEmail: "ceo@acmelogistics.com" },
  { id: "3", name: "Greenfield Bakery", adminEmail: "manager@greenfield.ph" },
];

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = React.useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState("1");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  // Define sidebar navigation groups
  const navGroups = [
    {
      title: "Navigation",
      items: [
        { label: "Dashboard", href: "/workspace", Icon: HiOutlineHome, isActive: true },
        { label: "Client Database", href: "#", Icon: HiOutlineFolderOpen },
      ],
    },
    {
      title: "Statutory Tools",
      items: [
        { label: "BIR Filing Alphalist", href: "#", Icon: HiOutlineShieldCheck },
        { label: "SSS/HDMF Contributions", href: "#", Icon: HiOutlineClock },
      ],
    },
    {
      title: "Team & Staff",
      items: [
        { label: "Manage Partners", href: "#", Icon: HiOutlineUserGroup },
      ],
    },
  ];

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
  };

  const handleCreateWorkspace = (data: { name: string; adminEmail: string }) => {
    const newWorkspace = {
      id: String(workspaces.length + 1),
      name: data.name,
      adminEmail: data.adminEmail,
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  return (
    <AppShell
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspaceId}
      onSelectWorkspace={handleSelectWorkspace}
      onCreateWorkspaceClick={() => setCreateDialogOpen(true)}
      navGroups={navGroups}
      user={{
        name: "Hervey Mapa",
        email: "hervey@dalia.ph",
      }}
      onLogoutClick={() => console.log("Logout triggered")}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
              {activeWorkspace?.name}
            </h1>
            <p className="mt-1.5 text-base text-muted-foreground">
              Client Workspace Overview & Configuration
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 self-start font-display">
            <HiPlus className="size-4" />
            New Workspace
          </Button>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border/60 bg-card p-6 shadow-sm">
            <CardHeader className="p-0 mb-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HiOutlineHome className="size-5" />
              </span>
              <CardTitle className="text-lg font-bold mt-3">Workspace Identity</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                General company properties and workspace indicators.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-2 mt-4 pt-4 border-t border-border/40">
              <div>
                <span className="text-muted-foreground font-semibold">Workspace Name:</span>
                <span className="ml-2 font-bold text-foreground">{activeWorkspace?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Workspace ID:</span>
                <span className="ml-2 font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">
                  {activeWorkspace?.id}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card p-6 shadow-sm">
            <CardHeader className="p-0 mb-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <HiOutlineEnvelopeOpen className="size-5" />
              </span>
              <CardTitle className="text-lg font-bold mt-3">Company Admin</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Active contact role for managing company integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 text-sm space-y-2 mt-4 pt-4 border-t border-border/40">
              <div>
                <span className="text-muted-foreground font-semibold">Designated Admin:</span>
                <span className="ml-2 font-bold text-foreground">{activeWorkspace?.adminEmail}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Access Privilege:</span>
                <span className="ml-2 rounded bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-500 uppercase">
                  Pending Invite
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspace creation dialog */}
        <CreateWorkspaceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreate={handleCreateWorkspace}
        />
      </div>
    </AppShell>
  );
}
```

- [ ] **Step 2: Delete the misplaced file outside `app/`**

Run: `rm apps/web/workspace/page.tsx` (or delete in Windows shell using `Remove-Item`)

- [ ] **Step 3: Verify the entire project build and dev server**

1. Run: `bun run check-types` in root directory
   Expected: Exits successfully (code 0) without type errors.
2. Run: `bun run dev` in root directory
   Expected: Starts Turbopack development servers successfully on ports 3000, 3001, 3002.

- [ ] **Step 4: Commit**
```bash
git rm apps/web/workspace/page.tsx
git add apps/web/app/workspace/page.tsx
git commit -m "feat(web): integrate workspace page layout and creation dialog"
```
