import { db, activityLog, eq, and, desc, ilike, sql } from "@repo/db";

export interface GetActivityLogsParams {
  companyId?: string;
  entityType?: string;
  entityId?: string;
  actorId?: string;
  action?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getActivityLogs(params: GetActivityLogsParams = {}) {
  try {
    const {
      companyId,
      entityType,
      entityId,
      actorId,
      action,
      search,
      limit = 50,
      offset = 0,
    } = params;

    const conditions: any[] = [];

    if (companyId) {
      conditions.push(eq(activityLog.companyId, companyId));
    }
    if (entityType) {
      conditions.push(eq(activityLog.entityType, entityType));
    }
    if (entityId) {
      conditions.push(eq(activityLog.entityId, entityId));
    }
    if (actorId) {
      conditions.push(eq(activityLog.actorId, actorId));
    }
    if (action && action !== "ALL") {
      conditions.push(eq(activityLog.action, action));
    }
    if (search) {
      conditions.push(
        sql`(${activityLog.summary} ILIKE ${`%${search}%`} OR ${activityLog.actorName} ILIKE ${`%${search}%`} OR ${activityLog.entityType} ILIKE ${`%${search}%`})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const logs = await db
      .select()
      .from(activityLog)
      .where(whereClause)
      .orderBy(desc(activityLog.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activityLog)
      .where(whereClause);

    return {
      logs,
      totalCount: Number(countResult?.count ?? 0),
    };
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return { logs: [], totalCount: 0 };
  }
}
