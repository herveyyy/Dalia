import { db, user, eq } from "@repo/db";
import { unstable_cache } from "next/cache";

const getCachedUser = unstable_cache(
  async (userId: string) => {
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
  ["user"],
  { tags: ["user"] }
);

export async function getUserRecord(userId: string) {
  return getCachedUser(userId);
}
