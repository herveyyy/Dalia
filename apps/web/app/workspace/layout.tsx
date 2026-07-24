import * as React from "react";
import { Suspense } from "react";
import { and, db, employee, eq, sql } from "@repo/db";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "./utils/components/workspace-shell";
import { getOverviewCompany } from "./utils/queries/get/get-overview-company.query";
import { getSessionTenant } from "./utils/lib/session-tenant";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getSessionTenant();

  if (!tenant.session) {
    redirect("/login");
  }

  const { user } = tenant.session;

  // Client company admin/employee: only their workspace, no firm panel
  if (tenant.isClientTenant && tenant.clientWorkspace) {
    const ws = tenant.clientWorkspace;
    const adminEmail = ws.adminEmail?.trim() || user.email;

    const [adminEmployee] = await db
      .select({ userId: employee.userId, workEmail: employee.workEmail })
      .from(employee)
      .where(
        and(
          eq(employee.companyId, ws.id),
          sql`lower(${employee.workEmail}) = ${adminEmail.toLowerCase()}`
        )
      )
      .limit(1);

    const initialWorkspaces = [
      {
        id: ws.id,
        name: ws.name,
        adminEmail: adminEmployee?.workEmail || adminEmail,
        isFirm: false as const,
        adminHasLogin: Boolean(adminEmployee?.userId),
      },
    ];

    return (
      <Suspense fallback={null}>
        <WorkspaceShell
          user={{
            name: user.name,
            email: user.email,
            avatarUrl: user.image ?? undefined,
          }}
          initialWorkspaces={initialWorkspaces}
          canManageFirm={false}
        >
          {children}
        </WorkspaceShell>
      </Suspense>
    );
  }

  if (!tenant.isFirmUser) {
    redirect("/apps");
  }

  const overview = await getOverviewCompany(user.id);

  const firmWorkspace = overview?.company
    ? {
        id: overview.company.id,
        name: `${overview.company.name} (Internal)`,
        adminEmail: user.email,
        isFirm: true as const,
      }
    : {
        id: "1",
        name: "Dalia Firm (Internal)",
        adminEmail: user.email,
        isFirm: true as const,
      };

  const clientWorkspaces = await Promise.all(
    (overview?.workspaces ?? []).map(async (w) => {
      const adminEmail = w.adminEmail?.trim() || "";

      let resolvedAdmin = adminEmail;
      let adminHasLogin = false;

      if (adminEmail) {
        const [adminEmployee] = await db
          .select({
            workEmail: employee.workEmail,
            userId: employee.userId,
          })
          .from(employee)
          .where(
            and(
              eq(employee.companyId, w.id),
              sql`lower(${employee.workEmail}) = ${adminEmail.toLowerCase()}`
            )
          )
          .limit(1);

        if (adminEmployee) {
          resolvedAdmin = adminEmployee.workEmail || adminEmail;
          adminHasLogin = Boolean(adminEmployee.userId);
        }
      } else {
        const [firstEmployee] = await db
          .select({
            workEmail: employee.workEmail,
            userId: employee.userId,
          })
          .from(employee)
          .where(eq(employee.companyId, w.id))
          .limit(1);

        if (firstEmployee?.workEmail) {
          resolvedAdmin = firstEmployee.workEmail;
          adminHasLogin = Boolean(firstEmployee.userId);
        }
      }

      return {
        id: w.id,
        name: w.name,
        adminEmail: resolvedAdmin || user.email,
        isFirm: false as const,
        adminHasLogin,
      };
    })
  );

  return (
    <Suspense fallback={null}>
      <WorkspaceShell
        user={{
          name: user.name,
          email: user.email,
          avatarUrl: user.image ?? undefined,
        }}
        initialWorkspaces={[firmWorkspace, ...clientWorkspaces]}
        canManageFirm
      >
        {children}
      </WorkspaceShell>
    </Suspense>
  );
}
