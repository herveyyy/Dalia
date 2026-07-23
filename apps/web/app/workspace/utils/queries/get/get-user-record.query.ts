import { db, user, eq } from "@repo/db";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

const getCachedUser = (userId: string) =>
  unstable_cache(
    async () => {
      try {
        const [userRecord] = await db
          .select()
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);

        return userRecord ?? null;
      } catch (error) {
        console.error("Failed to fetch user record:", error);
        throw new Error("Failed to fetch user record");
      }
    },
    [`user-${userId}`],
    { tags: [`user-${userId}`] }
  )();

export async function getUserRecord(userId: string) {
  return getCachedUser(userId);
}
