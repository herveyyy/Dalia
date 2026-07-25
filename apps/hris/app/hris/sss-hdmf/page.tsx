import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HiOutlineClock, HiOutlineDocumentText, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { getUserRecord, getCompanyRecord } from "../utils/queries/employee-queries";

const mockContributions = [
  { month: "January 2025", sss: "₱12,400", hdmf: "₱3,200", status: "Remitted" },
  { month: "February 2025", sss: "₱12,400", hdmf: "₱3,200", status: "Remitted" },
  { month: "March 2025", sss: "₱12,950", hdmf: "₱3,350", status: "Pending" },
  { month: "April 2025", sss: "—", hdmf: "—", status: "Upcoming" },
];

const statusColors: Record<string, string> = {
  Remitted: "bg-green-500/10 text-green-600",
  Pending: "bg-amber-500/10 text-amber-600",
  Upcoming: "bg-muted text-muted-foreground",
};

export default async function HrisSssHdmfPage() {
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
            SSS/HDMF Contributions
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Monthly SSS and HDMF statutory contribution records for {companyRecord?.name || "Company"}.
          </p>
        </div>
        <Button className="font-display gap-2">
          <HiOutlinePlus className="size-4" />
          New Contribution Return
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockContributions.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HiOutlineClock className="size-5" />
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    statusColors[item.status]
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {item.month}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>SSS: <span className="font-semibold text-foreground">{item.sss}</span></p>
                  <p>HDMF: <span className="font-semibold text-foreground">{item.hdmf}</span></p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
              <button className="flex items-center gap-1 font-semibold text-primary hover:underline">
                <HiOutlineDocumentText className="size-4" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
