import { db, eq, workspace } from "@repo/db";
import { unstable_cache } from "next/cache";

const getCachedWorkspaces = unstable_cache(
  async (companyId: string) => {
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
  ["workspaces-list"],
  { tags: ["workspaces-list"] }
);

export async function getCompanyWorkspaces(companyId: string) {
  return getCachedWorkspaces(companyId);
}
