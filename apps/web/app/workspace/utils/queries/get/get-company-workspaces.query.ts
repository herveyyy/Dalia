import { db, eq, workspace } from "@repo/db";
import { unstable_cache } from "next/cache";

const getCachedWorkspaces = (companyId: string) =>
  unstable_cache(
    async () => {
      try {
        return await db
          .select()
          .from(workspace)
          .where(eq(workspace.companyId, companyId));
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
        throw new Error("Failed to fetch workspaces");
      }
    },
    [`workspaces-list-${companyId}-v2`],
    { tags: [`workspaces-list-${companyId}`, "workspaces-list"] }
  )();

export async function getCompanyWorkspaces(companyId: string) {
  return getCachedWorkspaces(companyId);
}
