import { db, company, employee, workspace } from "@repo/db";
import { revalidateTag } from "next/cache";
import { assertFirmAccess } from "../../lib/assert-firm-access";
import { getSessionTenant } from "../../lib/session-tenant";

function nameFromEmail(email: string) {
  const local = email.split("@")[0] || "Admin";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const firstName = parts[0] ? cap(parts[0]) : "Admin";
  const lastName = parts.length > 1 ? parts.slice(1).map(cap).join(" ") : "User";
  return { firstName, lastName };
}

export async function postCreateWorkspace(data: {
  name: string;
  adminEmail: string;
  websiteUrl?: string;
  headquarters?: string;
  description?: string;
  logoUrl?: string;
}) {
  try {
    const tenant = await getSessionTenant();
    if (!tenant.session || !tenant.isFirmUser || !tenant.companyId) {
      throw new Error("Firm access only");
    }

    await assertFirmAccess(tenant.companyId);

    const adminEmail = data.adminEmail.trim().toLowerCase();
    if (!adminEmail) {
      throw new Error("Admin email is required");
    }

    const firmCompanyId = tenant.companyId;

    // Client company shares the workspace id so ?company_id= scopes HR data.
    const [clientCompany] = await db
      .insert(company)
      .values({
        name: data.name,
        websiteUrl: data.websiteUrl,
        headquarters: data.headquarters,
        description: data.description,
        logoUrl: data.logoUrl,
        createdBy: tenant.session.user.id,
      })
      .returning();

    if (!clientCompany) {
      throw new Error("Failed to create client company");
    }

    const [newWorkspace] = await db
      .insert(workspace)
      .values({
        id: clientCompany.id,
        companyId: firmCompanyId,
        name: data.name,
        adminEmail,
        websiteUrl: data.websiteUrl,
        headquarters: data.headquarters,
        description: data.description,
        logoUrl: data.logoUrl,
        createdBy: tenant.session.user.id,
      })
      .returning();

    if (!newWorkspace) {
      throw new Error("Failed to create workspace");
    }

    const { firstName, lastName } = nameFromEmail(adminEmail);

    await db.insert(employee).values({
      companyId: clientCompany.id,
      firstName,
      lastName,
      workEmail: adminEmail,
      jobTitle: "Company Admin",
      employmentStatus: "Active",
    });

    revalidateTag("workspaces-list", {});
    revalidateTag(`workspaces-list-${firmCompanyId}`, {});
    revalidateTag(`overview-company-${tenant.session.user.id}`, {});

    return newWorkspace;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create workspace"
    );
  }
}
