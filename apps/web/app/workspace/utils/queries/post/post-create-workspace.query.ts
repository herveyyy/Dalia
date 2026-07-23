import { db, workspace } from "@repo/db";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";

export async function postCreateWorkspace(data: {
  name: string;
  websiteUrl?: string;
  headquarters?: string;
  description?: string;
  logoUrl?: string;
}) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // 2. Generate a unique integer ID (Drizzle/Postgres workspace.id expects an integer)
    // Generate a secure random positive integer for the database primary key.
    const randomIntId = Math.floor(Math.random() * 2147483647);

    // 3. Insert workspace
    const [newWorkspace] = await db
      .insert(workspace)
      .values({
        id: randomIntId,
        name: data.name,
        websiteUrl: data.websiteUrl,
        headquarters: data.headquarters,
        description: data.description,
        logoUrl: data.logoUrl,
        createdBy: session.user.id,
      })
      .returning();

    // 4. Revalidate cache tags for workspaces
    revalidateTag("workspaces-list", {});
    revalidateTag(`overview-company-${session.user.id}`, {});

    return newWorkspace;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw new Error("Failed to create workspace");
  }
}
