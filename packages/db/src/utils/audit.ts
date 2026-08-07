import { activityLog, NewActivityLog } from "../schema/activity/tables";

export const DEFAULT_SENSITIVE_FIELDS = [
  "password",
  "accessToken",
  "refreshToken",
  "idToken",
  "secret",
  "ssnNo",
  "tin",
  "philhealth",
  "pagIbig",
  "philIdNo",
  "bankAccountNumber",
];

export interface FieldDiff {
  old: any;
  new: any;
}

export type ChangesDiff = Record<string, FieldDiff>;

export interface SanitizeAndDiffResult {
  sanitizedOld: Record<string, any> | null;
  sanitizedNew: Record<string, any> | null;
  changes: ChangesDiff;
}

/**
 * Sanitizes object data (redacts sensitive keys) and calculates field-level differences.
 */
export function computeJsonDiff(
  oldObj: Record<string, any> | null | undefined,
  newObj: Record<string, any> | null | undefined,
  sensitiveFields: string[] = DEFAULT_SENSITIVE_FIELDS
): SanitizeAndDiffResult {
  const sanitize = (obj: Record<string, any> | null | undefined) => {
    if (!obj || typeof obj !== "object") return null;
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (sensitiveFields.includes(key)) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  };

  const sanitizedOld = sanitize(oldObj);
  const sanitizedNew = sanitize(newObj);
  const changes: ChangesDiff = {};

  if (!sanitizedOld && sanitizedNew) {
    for (const key of Object.keys(sanitizedNew)) {
      changes[key] = { old: null, new: sanitizedNew[key] };
    }
  } else if (sanitizedOld && !sanitizedNew) {
    for (const key of Object.keys(sanitizedOld)) {
      changes[key] = { old: sanitizedOld[key], new: null };
    }
  } else if (sanitizedOld && sanitizedNew) {
    const allKeys = new Set([
      ...Object.keys(sanitizedOld),
      ...Object.keys(sanitizedNew),
    ]);

    for (const key of allKeys) {
      // Ignore timestamp keys like updatedAt if needed or compare values
      const valOld = sanitizedOld[key];
      const valNew = sanitizedNew[key];

      if (JSON.stringify(valOld) !== JSON.stringify(valNew)) {
        changes[key] = {
          old: valOld !== undefined ? valOld : null,
          new: valNew !== undefined ? valNew : null,
        };
      }
    }
  }

  return {
    sanitizedOld,
    sanitizedNew,
    changes,
  };
}

export interface LogActivityParams {
  companyId?: string | null;
  actorId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  entityType: string;
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "ARCHIVE" | "RESTORE" | "BULK_UPDATE" | string;
  summary?: string;
  oldData?: Record<string, any> | null;
  newData?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  sensitiveFields?: string[];
}

/**
 * Creates an entry in the activity_log table.
 */
export async function logActivity(
  dbInstance: any,
  params: LogActivityParams
) {
  try {
    const { sanitizedOld, sanitizedNew, changes } = computeJsonDiff(
      params.oldData,
      params.newData,
      params.sensitiveFields
    );

    const newLog: NewActivityLog = {
      companyId: params.companyId || null,
      actorId: params.actorId || null,
      actorName: params.actorName || null,
      actorEmail: params.actorEmail || null,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      summary: params.summary || `${params.action} on ${params.entityType} (${params.entityId})`,
      oldData: sanitizedOld,
      newData: sanitizedNew,
      changes: changes,
      metadata: params.metadata || null,
    };

    const inserted = await dbInstance.insert(activityLog).values(newLog).returning();
    return inserted[0];
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Non-blocking error so primary user mutations don't fail if log insertion fails
    return null;
  }
}
