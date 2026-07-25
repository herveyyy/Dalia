# Design Document: RBAC Role & Access Rights Architecture

**Date:** 2026-07-25  
**Status:** Approved  
**Scope:** `apps/web`, `packages/db`, `@repo/rbac`

---

## 1. Overview & Context

This design document defines a developer-friendly Role-Based Access Control (RBAC) system for Dalia. The system supports multi-tenant company custom roles and grants feature-level access across four primary app modules defined in `APP_ACCESS_CATALOG`:

1. **Firm Workspace** (`workspace.*`): Multi-client firm control panel (dashboard, clients, partners, employees, departments, branches, roles, BIR, SSS/HDMF).
2. **Dalia ERP** (`hris.*`): Payroll, timekeeping, employee directory, job postings, tax settings.
3. **Finance & Sales** (`finance.*`): Invoicing, books, tax filings.
4. **Operations CRM** (`crm.*`): Pipelines, retainers.

---

## 2. Architectural Layers

The architecture balances **Next.js 16 `proxy.ts`** (optimistic route redirects) with **Server-side DB validation** and **Client UI permission guards**.

```
                          ┌──────────────────────────┐
                          │   Next.js 16 proxy.ts    │  Layer 1: Optimistic Cookie/JWT Route Guard
                          └────────────┬─────────────┘  (Fast redirect before page load)
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │ Server Component Pages   │  Layer 2: DB-Backed Page Guard & Helpers
                          │ (enforcePermission)      │  (Type-safe & cached per request)
                          └────────────┬─────────────┘
                                       │
                                       ▼
┌──────────────────────────┐               ┌──────────────────────────┐
│ Server Actions & API     │               │ Client Components        │  Layer 3: UI & Action Protection
│ (assertPermission)       │               │ (<PermissionGuard>)      │  (Fine-grained button/feature access)
└──────────────────────────┘               └──────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 Type-Safe Catalog Keys (`FeatureKey`)

```ts
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
```

---

### 3.2 Layer 1: Next.js 16 `proxy.ts` (Optimistic Route Redirects)

Located at the root of `apps/web` (or `src/`):

- **Purpose:** Optimistic, zero-latency redirect before streaming HTML.
- **Rule:** Reads session cookies / JWT claims. Avoids un-cached DB calls in proxy runtime.

```ts
// apps/web/proxy.ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("dalia_session")?.value;
  const pathname = request.nextUrl.pathname;

  // Protected route optimistic auth check
  if (!token && (pathname.startsWith("/workspace") || pathname.startsWith("/jobs"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/jobs/:path*"],
};
```

---

### 3.3 Layer 2: Server-Side Page & Action Guards (`lib/rbac/server.ts`)

Leverages `React.cache()` to ensure user permissions are loaded from DB at most **once per request**.

```ts
import { cache } from "react";
import { redirect } from "next/navigation";
import { db, rolePermission, appFeature, userRole, eq, and } from "@repo/db";
import { resolveTenantCompanyId } from "@/app/workspace/utils/lib/resolve-tenant-company";
import type { FeatureKey } from "./types";

export const getTenantPermissions = cache(async (companyId: string) => {
  const { session } = await resolveTenantCompanyId(companyId);
  if (!session) return { session: null, permissions: new Set<FeatureKey>() };

  // Fetch user role permissions for companyId
  const permissionsList = await db
    .select({ key: appFeature.key })
    .from(userRole)
    .innerJoin(rolePermission, eq(userRole.roleId, rolePermission.roleId))
    .innerJoin(appFeature, eq(rolePermission.featureId, appFeature.id))
    .where(eq(userRole.userId, session.user.id));

  const permissions = new Set<FeatureKey>(permissionsList.map((p) => p.key as FeatureKey));
  return { session, permissions };
});

export async function enforcePermission(featureKey: FeatureKey, companyId?: string) {
  const resolvedCompanyId = companyId || (await resolveTenantCompanyId()).companyId;
  const { session, permissions } = await getTenantPermissions(resolvedCompanyId);

  if (!session || !permissions.has(featureKey)) {
    redirect("/403");
  }

  return { session, permissions };
}

export async function assertPermission(featureKey: FeatureKey, companyId?: string) {
  const resolvedCompanyId = companyId || (await resolveTenantCompanyId()).companyId;
  const { session, permissions } = await getTenantPermissions(resolvedCompanyId);

  if (!session || !permissions.has(featureKey)) {
    throw new Error(`Unauthorized: Missing permission '${featureKey}'`);
  }

  return { session, permissions };
}
```

---

### 3.4 Layer 3: Client Component & UI Hooks (`lib/rbac/client.tsx`)

Provides a clean React Context Provider, `usePermissions()` hook, and `<PermissionGuard>` component.

```tsx
"use client";

import React, { createContext, useContext } from "react";
import type { FeatureKey } from "./types";

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
  const set = React.useMemo(() => new Set(permissions), [permissions]);
  const value = React.useMemo(
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

---

## 4. Verification & Testing Strategy

1. **Unit Verification:**
   - Type validation for catalog keys in `@repo/db` and `FeatureKey`.
2. **Server Action Guard Verification:**
   - Attempting to call `saveRoleAction` or `runPayrollAction` without permissions returns `Unauthorized: Missing permission`.
3. **Page Route Verification:**
   - Navigating directly to restricted URL redirects to `/403` or `/login` smoothly.
