import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserRecord } from "../utils/queries/employee-queries";
import { getActivityLogs } from "../utils/queries/activity-queries";
import { ActivityLogTable } from "../../../components/activity-log/activity-log-table";

export default async function HrisActivityLogsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const userRecord = await getUserRecord(session.user.id);
  const companyId = userRecord?.companyId ?? undefined;

  const { logs, totalCount } = await getActivityLogs({
    companyId,
    limit: 100,
  });

  const formattedLogs = logs.map((log) => ({
    ...log,
    createdAt: String(log.createdAt),
    oldData: (log.oldData as Record<string, any>) ?? null,
    newData: (log.newData as Record<string, any>) ?? null,
    changes: (log.changes as Record<string, { old: any; new: any }>) ?? null,
    metadata: (log.metadata as Record<string, any>) ?? null,
  }));

  return (
    <div className="space-y-6">
      <ActivityLogTable initialLogs={formattedLogs} totalCount={totalCount} />
    </div>
  );
}
