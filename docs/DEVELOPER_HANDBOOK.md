# Dalia Architecture & Developer Handbook

Welcome to the Dalia Developer Handbook. This guide explains the standard **Data & Execution Flow**, how to build features, the **must-have syntax** for each layer, and how to **debug issues step-by-step** from the UI down to the database.

---

## 1. The Architecture Flow

All features in Dalia follow a strict 4-layer unidirectional flow:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. App Pages & Components (app/.../page.tsx)                                 │
│    - Renders UI, handles client state                                       │
│    - Guards page access via enforcePermission("feature.key")                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Server Actions (app/.../actions/*.ts)                                    │
│    - Handles mutations (create, update, delete)                             │
│    - Guards execution via assertPermission("feature.key")                   │
│    - Revalidates cached paths via revalidatePath()                          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Data Queries (app/.../queries/*.ts)                                      │
│    - Pure read-only database fetches                                        │
│    - Wrapped in React.cache() for request-level deduplication               │
│    - Enforces tenant isolation (eq(table.companyId, companyId))             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Shared Monorepo Packages (@repo/db, @repo/ui, @repo/auth, @repo/rbac)    │
│    - Drizzle ORM tables & catalog seeds                                      │
│    - Reusable UI primitives & shared utilities                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Rules, Syntax & Must-Haves

### Layer 1: App Pages & Layouts (`app/.../page.tsx`)

**Responsibility:** Page route entry point, layout structure, page-level authorization.

#### Must-Haves in Every Page:
- `export default async function Page()` (Async Server Component)
- Page-level RBAC guard: `await enforcePermission("feature.key")`
- Explicit page props handling (searchParams, params)

#### Standard Syntax Template:
```tsx
import { enforcePermission } from "@/app/workspace/utils/lib/rbac-server";
import { getOrgDataQuery } from "../queries/get-org.query";
import { ClientPanel } from "../components/client-panel";

interface PageProps {
  searchParams: Promise<{ company_id?: string }>;
}

export default async function RolesPage({ searchParams }: PageProps) {
  const { company_id } = await searchParams;

  // 1. MUST-HAVE: Page Access Guard (redirects to /403 if unauthorized)
  const { session, companyId, permissions } = await enforcePermission(
    "workspace.roles.manage",
    company_id
  );

  // 2. Fetch page data via Query function
  const data = await getOrgDataQuery(companyId);

  // 3. Render client or server component
  return <ClientPanel initialData={data} permissions={Array.from(permissions)} />;
}
```

---

### Layer 2: Server Actions (`app/.../actions/*.ts`)

**Responsibility:** Data mutations (Create, Update, Delete), RBAC enforcement, path revalidation.

#### Must-Haves in Every Action:
- `"use server";` directive at top of file
- Action-level RBAC guard: `await assertPermission("feature.key", companyId)`
- Input validation & trimming
- Revalidation: `revalidatePath(...)`
- Structured return object: `{ success: true, message: "..." }` or throwing formatted errors

#### Standard Syntax Template:
```ts
"use server";

import { db, role, rolePermission, eq, and } from "@repo/db";
import { revalidatePath } from "next/cache";
import { assertPermission } from "@/app/workspace/utils/lib/rbac-server";

export async function saveRoleAction(data: {
  id?: string | null;
  companyId: string;
  name: string;
  featureIds: string[];
}) {
  // 1. MUST-HAVE: Action Access Guard (throws if missing permission)
  await assertPermission("workspace.roles.manage", data.companyId);

  // 2. MUST-HAVE: Input Validation
  const name = data.name.trim();
  if (!name) throw new Error("Role name is required");

  // 3. Execute DB Mutation
  if (data.id) {
    await db.update(role).set({ name, updatedAt: new Date().toISOString() })
      .where(and(eq(role.id, data.id), eq(role.companyId, data.companyId)));
  } else {
    await db.insert(role).values({ companyId: data.companyId, name, createdBy: session.user.id });
  }

  // 4. MUST-HAVE: Revalidate affected pages
  revalidatePath("/workspace/roles");

  // 5. MUST-HAVE: Structured Response
  return { success: true, message: "Role saved successfully" };
}
```

---

### Layer 3: Data Queries (`app/.../queries/*.ts`)

**Responsibility:** Fetching read-only data for pages and components.

#### Must-Haves in Every Query:
- Wrapped in `React.cache()` to deduplicate identical fetches in a single request cycle
- Strictly scope queries by `companyId` (Tenant Isolation)
- Return clean, explicitly typed data contracts

#### Standard Syntax Template:
```ts
import { cache } from "react";
import { db, role, rolePermission, eq, and } from "@repo/db";

export const getRolesByCompanyQuery = cache(async (companyId: string) => {
  if (!companyId) return [];

  // MUST-HAVE: Always filter by companyId for tenant isolation
  const rolesList = await db
    .select({
      id: role.id,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
    })
    .from(role)
    .where(eq(role.companyId, companyId));

  return rolesList;
});
```

---

### Layer 4: Shared Packages (`packages/*`)

**Responsibility:** Centralized database schema, permissions catalog, shared UI, auth.

#### Must-Haves in Packages:
- **`@repo/db`**: Export Drizzle tables in `schema/*/tables.ts` and catalog in `schema/rbac/catalog.ts`.
- **`@repo/ui`**: Atomic components (`Button`, `Input`, `Dialog`).
- **`@repo/rbac`**: Shared FeatureKey types and permission helper modules.

---

## 3. How to Debug (Developer Read Flow)

When an issue or bug occurs (e.g. "Saving a role fails" or "Page shows 403"), follow this exact **4-step trace workflow**:

```
[Issue Reported] ──► Step 1: UI / Console ──► Step 2: Page Route ──► Step 3: Server Action ──► Step 4: DB Query
```

### Step 1: Inspect the Client UI
- Open Browser DevTools (F12) → **Console** and **Network** tabs.
- Filter by `Fetch/XHR`. Trigger the action.
- Look at the **Response Payload**:
  - `403 Forbidden` / `Unauthorized` ➔ Access issue in Page or Server Action RBAC.
  - `500 Internal Server Error` ➔ Thrown error in Server Action or DB Query.

### Step 2: Check Page Route (`app/.../page.tsx`)
- Verify `searchParams` contains the expected `company_id`.
- Ensure `enforcePermission("feature.key")` uses the correct `FeatureKey` matching `APP_ACCESS_CATALOG`.

### Step 3: Inspect Server Action (`app/.../actions/*.ts`)
- Add a server log at the top of the action:
  ```ts
  console.log("[saveRoleAction] Payload:", data);
  ```
- Check terminal running `bun dev` to verify the payload received by the server.
- Verify `assertPermission(...)` passes.

### Step 4: Inspect Database Queries (`packages/db`)
- To log the raw SQL executed by Drizzle, call `.toSQL()`:
  ```ts
  const query = db.select().from(role).where(eq(role.companyId, companyId));
  console.log("[SQL Query]:", query.toSQL());
  ```
- Verify the foreign keys and tenant filtering (`companyId`).

---

## 4. Common Troubleshooting Quick-Reference

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **User redirected to `/403` unexpectedly** | Missing `role_permission` record for user's role in DB | Check `user_role` and `role_permission` table entries in DB or grant feature in `/workspace/roles`. |
| **"Unauthorized: Missing permission" error in action** | `assertPermission()` failed in Server Action | Ensure user has assigned role with that specific `FeatureKey`. |
| **Data not updating after save** | Missing `revalidatePath()` in action | Call `revalidatePath("/workspace/...")` inside your server action after mutation. |
| **TypeScript error on FeatureKey** | Key missing from `rbac-types.ts` | Add new key to `FeatureKey` type in `apps/web/app/workspace/utils/lib/rbac-types.ts` and `APP_ACCESS_CATALOG`. |
