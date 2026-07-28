import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppsHeader } from "../../components/apps-header";
import { AppsGrid } from "./utils/components/apps-grid";
import { getAppsPageData } from "./utils/queries/get-apps-data.query";

export default async function AppsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const { companyName, apps } = await getAppsPageData(user.id, user.companyId);

  return (
    <div className="min-h-screen bg-background">
      <AppsHeader companyName={companyName} userName={user.name} />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dalia ERP Applications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select an application below to manage your firm&apos;s workflows or client workspaces.
          </p>
        </div>

        <nav aria-label="ERP Applications Menu" className="mt-6">
          <AppsGrid apps={apps} />
        </nav>
      </main>
    </div>
  );
}