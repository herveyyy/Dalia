# Workspace Sidebar & Creation Flow Design Spec

**Date:** 2026-07-23
**Status:** Approved (Approach A)

This spec defines the visual and structural architecture of the `AppShell` component containing a responsive `Sidebar`, `WorkspaceSelector`, and `CreateWorkspaceDialog` to manage company workspaces in Dalia.

---

## 1. Requirements

* **Sidebar:**
  * Must be persistent on desktop (left-side) and collapsible drawer on mobile.
  * Displays the `WorkspaceSelector` at the top.
  * Shows navigation links.
  * Shows user profile/logout at the bottom.
* **Workspace Selector:**
  * Displays the current active workspace.
  * Shows a dropdown containing other company workspaces.
  * Features a button or link to "+ Create Workspace".
* **Workspace Creation Dialog:**
  * Triggered by the "+ Create Workspace" option in the dropdown or sidebar.
  * Collects:
    1. **Workspace Name** (string)
    2. **Admin/CEO Email** (string)
  * Accessible via standard dialog controls (Modal layout, backdrop, overlay, dismiss actions).

---

## 2. Component Design (Atomic Structure)

All reusable components will be defined inside `@repo/ui`.

### 2.1 Atoms

#### `Dialog` Components (`@repo/ui/components/atoms/Dialog`)
We will create dialog primitives wrapping `@base-ui/react/dialog` styled with Tailwind:
* `Dialog`: Root wrapper.
* `DialogTrigger`: Button/element triggering the dialog.
* `DialogPortal`: Portal container for rendering overlays.
* `DialogOverlay`: Full-screen blurred backdrop.
* `DialogContent`: Central content card with exit animations.
* `DialogTitle`: Accessible title wrapper.
* `DialogDescription`: Screen-reader descriptions.
* `DialogClose`: Dismiss icon or buttons.

#### `SidebarItem` (`@repo/ui/components/atoms/SidebarItem`)
A clickable navigation item supporting:
* `href`: String URL.
* `label`: String name.
* `icon`: React Component (e.g. from Lucide/Heroicons).
* `isActive`: Boolean indicating active path.
* `badge`: Optional string/number.

### 2.2 Molecules

#### `WorkspaceSelector` (`@repo/ui/components/molecules/WorkspaceSelector`)
A dropdown displaying:
* Current active workspace (Name and subtitle).
* Search input to filter workspaces.
* List of workspaces (switchable on click).
* "+ Create Workspace" trigger at the bottom.

#### `CreateWorkspaceDialog` (`@repo/ui/components/molecules/CreateWorkspaceDialog`)
* Implements the `Dialog` primitives.
* Renders a form containing Workspace Name & Admin Email fields.
* Form submit triggers callback `onCreate(data: { name: string; adminEmail: string })`.

### 2.3 Organisms

#### `AppSidebar` (`@repo/ui/components/organisms/AppSidebar`)
Renders:
* `WorkspaceSelector`
* List of `SidebarItem` navigation groups (e.g. Dashboard, Team, Payroll, Finance, Ops).
* Footer containing logged-in user profile summary and a "Logout" action.

#### `AppShell` (`@repo/ui/components/organisms/AppShell`)
A flexbox layout supporting:
* Desktop: Left-side fixed width sidebar, right-side full height scrollable main content.
* Mobile: Top bar with hamburger icon toggling the `AppSidebar` inside a slide-over mobile menu drawer.

---

## 3. Application Integration (`apps/web`)

We will place the workspace route under the Next.js app directory:
* **Route:** `/workspace`
* **File:** `apps/web/app/workspace/page.tsx`
* **State Management (Local/Mock):**
  * Manage workspaces state locally for now (as requested, skipping the DB/auth persistence layer for this step).
  * State includes:
    * `workspaces`: Array of `{ id, name, adminEmail }`.
    * `activeWorkspaceId`: String ID of the active company.
  * Form submission adds to the workspaces state array.
