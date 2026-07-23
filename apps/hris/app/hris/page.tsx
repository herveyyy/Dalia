import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HrisHeader } from "../../components/hris-header";
import {
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalculator,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/molecules/Card";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const stats = [
    {
      name: "Active Employees",
      value: "14",
      description: "12 salaried · 2 hourly",
      icon: HiOutlineUserGroup,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      name: "Timekeeping",
      value: "98.2%",
      description: "On-time attendance today",
      icon: HiOutlineClock,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      name: "Payroll Run (July)",
      value: "Pending",
      description: "Due in 5 days · 15th cycle",
      icon: HiOutlineCalculator,
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  const recentLogs = [
    { employee: "Mark Del Rosario", event: "Clocked In", time: "8:02 AM", status: "success" },
    { employee: "Sarah Santos", event: "Leave Request Submitted", time: "Yesterday", status: "pending" },
    { employee: "James Yap", event: "SSS/PhilHealth Computed", time: "July 22", status: "success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HrisHeader companyName={user.companyName} userName={user.name} />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/apps"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <HiOutlineArrowLeft className="size-3" /> Back to App Menu
            </a>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dalia HRIS
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your team, approve time logs, and process Philippine statutory payroll.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.name}
                className="border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/20"
              >
                <CardHeader className="p-0 flex flex-row items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.name}
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <span className={`flex size-12 items-center justify-center rounded-xl ${stat.color} shrink-0`}>
                    <Icon className="size-6" />
                  </span>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Statutory Calculations Panel */}
          <Card className="col-span-2 border border-border/60 bg-card p-6 shadow-sm">
            <CardHeader className="p-0">
              <CardTitle className="font-display text-lg font-bold">
                Statutory Payroll Calculator
              </CardTitle>
              <CardDescription className="text-sm">
                Compute SSS, PhilHealth, Pag-IBIG contributions, and withholding tax automatically.
              </CardDescription>
            </CardHeader>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-dashed border-border p-4 bg-muted/40">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">
                      Statutory Table Rules: 2026 Statutory Updates
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      All calculations are configured in compliance with current PhilHealth premium updates.
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    <HiOutlineCheckCircle className="size-3.5" /> Compliant
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    SSS Contribution Share
                  </span>
                  <span className="mt-1 font-display text-lg font-bold text-foreground block">
                    9.5% ER · 4.5% EE
                  </span>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    PhilHealth Contribution Share
                  </span>
                  <span className="mt-1 font-display text-lg font-bold text-foreground block">
                    2.5% ER · 2.5% EE
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Panel */}
          <Card className="border border-border/60 bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="p-0">
                <CardTitle className="font-display text-lg font-bold">
                  Recent Activities
                </CardTitle>
                <CardDescription className="text-sm">
                  Live updates from timekeeping and compliance.
                </CardDescription>
              </CardHeader>
              <ul className="mt-6 divide-y divide-border/60">
                {recentLogs.map((log, index) => (
                  <li key={index} className="py-3 flex justify-between gap-4 text-sm first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{log.employee}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.event}</p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">{log.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <a
              href="#"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-border bg-card px-4 py-2 font-display text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              View Audits
            </a>
          </Card>
        </div>
      </main>
    </div>
  );
}
