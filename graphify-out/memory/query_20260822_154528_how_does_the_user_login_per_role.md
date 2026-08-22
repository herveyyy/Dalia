---
type: "query"
date: "2026-08-22T15:45:28.455371+00:00"
question: "how does the user login per role"
contributor: "graphify"
source_nodes: ["getSessionTenant", "getTenantPermissions", "enforcePermission", "assertPermission"]
---

# Q: how does the user login per role

## Answer

User login and role-based access in this codebase operate through session resolution (Better Auth / getSessionTenant) paired with Role-Based Access Control (RBAC). A user session resolves companyId to distinguish Firm Users from Client Tenants (apps/web/app/workspace/utils/lib/session-tenant.ts). Feature access is evaluated by querying userRole -> rolePermission -> appFeature in packages/auth/src/rbac/server.ts via getTenantPermissions and enforcePermission.

## Source Nodes

- getSessionTenant
- getTenantPermissions
- enforcePermission
- assertPermission