import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HiOutlineShieldCheck, HiOutlineDocumentText, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { getUserRecord, getCompanyRecord } from "../utils/queries/employee-queries";

const mockFilings = [
  { period: "Q1 2025", deadline: "Apr 15, 2025", status: "Filed", employees: 42 },
  { period: "Q2 2025", deadline: "Jul 15, 2025", status: "Pending", employees: 44 },
  { period: "Q3 2025", deadline: "Oct 15, 2025", status: "Upcoming", employees: null },
];

const statusColors: Record<string, string> = {
  Filed: "bg-green-500/10 text-green-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Upcoming: "bg-muted text-muted-foreground",
};

export default async function HrisBirFilingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const userRecord = await getUserRecord(session.user.id);
  const companyId = userRecord?.companyId;

  if (!companyId) redirect("/apps");

  const companyRecord = await getCompanyRecord(companyId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            BIR Filing Alphalist
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Annual and quarterly BIR tax alphalist filings for {companyRecord?.name || "Company"}.
          </p>
        </div>
        <Button className="font-display gap-2">
          <HiOutlinePlus className="size-4" />
          Generate New Alphalist
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockFilings.map((filing, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineShieldCheck className="size-5" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    statusColors[filing.status]
                  }`}
                >
                  {filing.status}
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {filing.period}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Deadline: {filing.deadline}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
              <span className="text-muted-foreground">
                {filing.employees ? `${filing.employees} employees` : "Not generated"}
              </span>
              <button className="flex items-center gap-1 font-semibold text-primary hover:underline">
                <HiOutlineDocumentText className="size-4" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
