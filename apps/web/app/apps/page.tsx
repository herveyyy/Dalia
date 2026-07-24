import { auth } from "@repo/auth";
import { db, company, eq } from "@repo/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/molecules/Card";
import { Button, buttonVariants } from "@repo/ui/components/atoms/Button";
import { cn } from "@repo/ui/lib/utils";
import { AppsHeader } from "../../components/apps-header";

export default async function AppsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const companyRecord = user.companyId
    ? await db
        .select()
        .from(company)
        .where(eq(company.id, user.companyId))
        .then((res) => res[0])
    : null;
  const companyName = companyRecord?.name || null;

  const apps = [
    {
      id: "hris",
      name: "Dalia HRIS",
      description: "Philippine statutory payroll, automated timekeeping, and employee files.",
      icon: HiOutlineShieldCheck,
      href: "/hris",
      status: "active",
      statusLabel: "Launch App",
    },
    {
      id: "finance",
      name: "Finance & Sales",
      description: "Invoicing, automated bookkeeping, and tax filings for MSMEs.",
      icon: HiOutlineBuildingOffice2,
      href: "#",
      status: "coming_soon",
      statusLabel: "Request Early Access",
    },
    {
      id: "crm",
      name: "Operations CRM",
      description: "Manage client retainers, task pipelines, and firm operations in one place.",
      icon: HiOutlineRocketLaunch,
      href: "#",
      status: "coming_soon",
      statusLabel: "Request Early Access",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppsHeader companyName={companyName} userName={user.name} />
      
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Available Applications
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Select an application below to manage your firm&apos;s workflows or client workspaces.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const Icon = app.icon;
            const isActive = app.status === "active";

            return (
              <Card
                key={app.id}
                className={cn(
                  "flex flex-col justify-between border border-border/60 bg-card p-6 transition-all duration-200",
                  isActive 
                    ? "hover:border-primary/40 hover:shadow-md" 
                    : "opacity-80 bg-card/40 border-dashed backdrop-blur-[2px]"
                )}
              >
                <CardHeader className="p-0 gap-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full",
                        isActive ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    {!isActive && (
                      <span className="rounded-full bg-secondary/15 px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.5px] text-secondary uppercase">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle className="font-display text-lg font-bold mt-2">
                    {app.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground min-h-[48px]">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 mt-6 pt-0 border-t-0 bg-transparent">
                  {isActive ? (
                    <a
                      href={app.href}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full font-display gap-2"
                      )}
                    >
                      {app.statusLabel}
                      <HiOutlineArrowRight className="size-4" />
                    </a>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full font-display border-dashed opacity-60 cursor-not-allowed"
                    >
                      {app.statusLabel}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}