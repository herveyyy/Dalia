import { db, company, eq, user, workspace } from "@repo/db";
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const [userRecord] = await db
      .select({ companyId: user.companyId })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userRecord?.companyId) {
      throw new Error("User has no company");
    }

    // Client company shares the workspace id so ?company_id= scopes HR data.
    const [clientCompany] = await db
      .insert(company)
      .values({
        name: data.name,
        websiteUrl: data.websiteUrl,
        headquarters: data.headquarters,
        description: data.description,
        logoUrl: data.logoUrl,
        createdBy: session.user.id,
      })
      .returning();

    if (!clientCompany) {
      throw new Error("Failed to create client company");
    }

    const [newWorkspace] = await db
      .insert(workspace)
      .values({
        id: clientCompany.id,
        companyId: userRecord.companyId,
        name: data.name,
        websiteUrl: data.websiteUrl,
        headquarters: data.headquarters,
        description: data.description,
        logoUrl: data.logoUrl,
        createdBy: session.user.id,
      })
      .returning();

    revalidateTag("workspaces-list", {});
    revalidateTag(`workspaces-list-${userRecord.companyId}`, {});
    revalidateTag(`overview-company-${session.user.id}`, {});

    return newWorkspace;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw new Error("Failed to create workspace");
  }
}
