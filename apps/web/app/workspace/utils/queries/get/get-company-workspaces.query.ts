import { db, workspace } from "@repo/db";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

const getCachedWorkspaces = () =>
  unstable_cache(
    async () => {
      try {
        return await db.select().from(workspace);
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
        throw new Error("Failed to fetch workspaces");
      }
    },
    ["workspaces-list"],
    { tags: ["workspaces-list"] }
  )();

export async function getCompanyWorkspaces() {
  return getCachedWorkspaces();
}
