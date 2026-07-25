# RBAC Role & Access Rights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a type-safe, developer-friendly RBAC permission system across Next.js 16 `proxy.ts`, Server Component page guards, Server Action assertions, and Client Component permission wrappers.

**Architecture:** 3-layer security system: (1) Next.js 16 `proxy.ts` optimistic route protection, (2) DB-backed `enforcePermission()` / `assertPermission()` using `React.cache()`, and (3) Client-side `<PermissionGuard>` & `usePermissions()`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Drizzle ORM (`@repo/db`), React Server Components, React Context.

## Global Constraints

- **Catalog Sync:** Must map keys directly to `APP_ACCESS_CATALOG` in `@repo/db/schema/rbac/catalog.ts`.
- **Proxy Constraint:** `proxy.ts` must operate strictly on request headers/cookies (no uncached DB queries inside Proxy).
- **Request Cache:** `getTenantPermissions()` must use `React.cache()` to ensure single DB query per request cycle.

---

### Task 1: Type-Safe Permission Catalog Keys (`rbac-types.ts`)

**Files:**
- Create: `apps/web/app/workspace/utils/lib/rbac-types.ts`

**Interfaces:**
- Consumes: `APP_ACCESS_CATALOG` from `@repo/db`
- Produces: `FeatureKey` union type and `APP_MODULE_KEYS`

- [ ] **Step 1: Create `rbac-types.ts`**

```ts
import { APP_ACCESS_CATALOG } from "@repo/db";

export type FeatureKey =
  // Firm Workspace
  | "workspace.dashboard.view"
  | "workspace.clients.manage"
  | "workspace.partners.manage"
  | "workspace.employees.manage"
  | "workspace.departments.manage"
  | "workspace.branches.manage"
  | "workspace.roles.manage"
  | "workspace.bir.view"
  | "workspace.sss_hdmf.view"
  // Dalia ERP
  | "hris.directory.view"
  | "hris.directory.manage"
  | "hris.jobs.view"
  | "hris.jobs.manage"
  | "hris.taxes.view"
  | "hris.taxes.manage"
  | "hris.payroll.view"
  | "hris.payroll.run"
  // Finance & Sales
  | "finance.invoices.view"
  | "finance.invoices.manage"
  | "finance.books.view"
  | "finance.tax_filings.manage"
  // Operations CRM
  | "crm.pipeline.view"
  | "crm.pipeline.manage"
  | "crm.retainers.manage";

export type AppModuleKey = "workspace" | "hris" | "finance" | "crm";

export interface UserPermissions {
  companyId: string;
  userId: string;
  permissions: Set<FeatureKey>;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `bun run check-types` or `npx tsc --noEmit` in `apps/web`
Expected: PASS

- [ ] **Step 3: Commit Task 1**

```bash
git add apps/web/app/workspace/utils/lib/rbac-types.ts
git commit -m "feat(rbac): add type-safe FeatureKey definitions"
```

---

### Task 2: Server-Side Permission Guard Helpers (`rbac-server.ts`)

**Files:**
- Create: `apps/web/app/workspace/utils/lib/rbac-server.ts`

**Interfaces:**
- Consumes: `FeatureKey` from `./rbac-types.ts`, `db`, `userRole`, `rolePermission`, `appFeature` from `@repo/db`
- Produces: `getTenantPermissions`, `enforcePermission`, `assertPermission`

- [ ] **Step 1: Create `rbac-server.ts`**

```ts
import { cache } from "react";
import { redirect } from "next/navigation";
import { db, rolePermission, appFeature, userRole, eq } from "@repo/db";
import { resolveTenantCompanyId } from "./resolve-tenant-company";
import type { FeatureKey } from "./rbac-types";

export const getTenantPermissions = cache(async (companyId?: string) => {
  const { session, companyId: resolvedCompanyId, error } = await resolveTenantCompanyId(companyId);
  if (!session || error || !resolvedCompanyId) {
    return { session: null, companyId: null, permissions: new Set<FeatureKey>() };
  }

  const permissionsList = await db
    .select({ key: appFeature.key })
    .from(userRole)
    .innerJoin(rolePermission, eq(userRole.roleId, rolePermission.roleId))
    .innerJoin(appFeature, eq(rolePermission.featureId, appFeature.id))
    .where(eq(userRole.userId, session.user.id));

  const permissions = new Set<FeatureKey>(permissionsList.map((p) => p.key as FeatureKey));
  return { session, companyId: resolvedCompanyId, permissions };
});

export async function enforcePermission(featureKey: FeatureKey, companyId?: string) {
  const { session, companyId: resolved, permissions } = await getTenantPermissions(companyId);

  if (!session || !permissions.has(featureKey)) {
    redirect("/403");
  }

  return { session, companyId: resolved, permissions };
}

export async function assertPermission(featureKey: FeatureKey, companyId?: string) {
  const { session, companyId: resolved, permissions } = await getTenantPermissions(companyId);

  if (!session || !permissions.has(featureKey)) {
    throw new Error(`Unauthorized: Missing permission '${featureKey}'`);
  }

  return { session, companyId: resolved, permissions };
}
```

- [ ] **Step 2: Verify compilation**

Run: `bun run check-types`
Expected: PASS

- [ ] **Step 3: Commit Task 2**

```bash
git add apps/web/app/workspace/utils/lib/rbac-server.ts
git commit -m "feat(rbac): implement server-side permission enforcement with React cache"
```

---

### Task 3: Client Component Permission Guard & Hook (`rbac-client.tsx`)

**Files:**
- Create: `apps/web/app/workspace/utils/lib/rbac-client.tsx`

**Interfaces:**
- Consumes: `FeatureKey` from `./rbac-types.ts`
- Produces: `RBACProvider`, `usePermissions`, `<PermissionGuard>`

- [ ] **Step 1: Create `rbac-client.tsx`**

```tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { FeatureKey } from "./rbac-types";

interface RBACContextType {
  permissions: Set<FeatureKey>;
  hasPermission: (key: FeatureKey) => boolean;
}

const RBACContext = createContext<RBACContextType>({
  permissions: new Set(),
  hasPermission: () => false,
});

export function RBACProvider({
  permissions,
  children,
}: {
  permissions: FeatureKey[];
  children: React.ReactNode;
}) {
  const set = useMemo(() => new Set(permissions), [permissions]);
  const value = useMemo(
    () => ({
      permissions: set,
      hasPermission: (key: FeatureKey) => set.has(key),
    }),
    [set]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function usePermissions() {
  return useContext(RBACContext);
}

export function PermissionGuard({
  feature,
  fallback = null,
  children,
}: {
  feature: FeatureKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();
  if (!hasPermission(feature)) return <>{fallback}</>;
  return <>{children}</>;
}
```

- [ ] **Step 2: Verify compilation**

Run: `bun run check-types`
Expected: PASS

- [ ] **Step 3: Commit Task 3**

```bash
git add apps/web/app/workspace/utils/lib/rbac-client.tsx
git commit -m "feat(rbac): add client-side RBACProvider and PermissionGuard"
```

---

### Task 4: Next.js 16 `proxy.ts` Optimistic Route Guard

**Files:**
- Create: `apps/web/proxy.ts`

**Interfaces:**
- Consumes: Next.js Request/Response cookies & headers
- Produces: Next.js 16 proxy middleware handler

- [ ] **Step 1: Create `apps/web/proxy.ts`**

```ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // Optimistic redirect if user is not authenticated and accesses protected route
  if (!sessionToken && pathname.startsWith("/workspace")) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*"],
};
```

- [ ] **Step 2: Verify compilation**

Run: `bun run check-types`
Expected: PASS

- [ ] **Step 3: Commit Task 4**

```bash
git add apps/web/proxy.ts
git commit -m "feat(rbac): add Next.js 16 proxy.ts optimistic route guard"
```
