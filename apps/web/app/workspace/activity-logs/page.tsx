import React from "react";
import { redirect } from "next/navigation";
import { db, getActivityLogs } from "@repo/db";
import { resolveTenantCompanyId } from "../utils/lib/resolve-tenant-company";
import { ActivityLogTable } from "../../../../hris/components/activity-log/activity-log-table";

export default async function WorkspaceActivityLogsPage(props: {
  searchParams?: Promise<{
    company_id?: string;
    page?: string;
    items?: string;
    q?: string;
    search?: string;
    action?: string;
    entity?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const selectorId = searchParams?.company_id;
  const page = Number(searchParams?.page || 1);
  const items = Number(searchParams?.items || 10);
  const search = searchParams?.q || searchParams?.search || "";
  const action = searchParams?.action || "ALL";
  const entityType = searchParams?.entity || "ALL";

  const { session, companyId, error } = await resolveTenantCompanyId(selectorId);
  if (!session || error || !companyId) {
    redirect("/login");
  }

  const { logs, totalCount } = await getActivityLogs(db, {
    companyId,
    action: action !== "ALL" ? action : undefined,
    entityType: entityType !== "ALL" ? entityType : undefined,
    search: search || undefined,
    limit: items,
    offset: (page - 1) * items,
  });

  const formattedLogs = logs.map((log: Record<string, any>) => ({
    id: String(log.id),
    companyId: (log.companyId as string) ?? null,
    actorId: (log.actorId as string) ?? null,
    actorName: (log.actorName as string) ?? null,
    actorEmail: (log.actorEmail as string) ?? null,
    entityType: String(log.entityType),
    entityId: String(log.entityId),
    action: String(log.action),
    summary: String(log.summary),
    createdAt: String(log.createdAt),
    oldData: (log.oldData as Record<string, any>) ?? null,
    newData: (log.newData as Record<string, any>) ?? null,
    changes: (log.changes as Record<string, { old: any; new: any }>) ?? null,
    metadata: (log.metadata as Record<string, any>) ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Activity Logs & Audit Trail
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete, version-controlled immutable audit trail of system mutations and data changes.
        </p>
      </div>

      <ActivityLogTable
        initialLogs={formattedLogs}
        totalCount={totalCount}
        page={page}
        itemsPerPage={items}
        search={search}
        actionFilter={action}
        entityFilter={entityType}
      />
    </div>
  );
}
