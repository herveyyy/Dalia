import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HrisHeader } from "../../components/hris-header";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { getCompanyRecord } from "./utils/queries/get/get-company-record.query";
import { getEmployees } from "./utils/queries/get/get-employees.query";
import { EmployeeDirectory } from "./utils/components/employee-directory";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // 1. Fetch company record using query utility
  const companyRecord = user.companyId ? await getCompanyRecord(user.companyId) : null;
  const companyName = companyRecord?.name || null;

  // 2. Fetch employee records with pre-joined relations using query utility
  const employeesList = user.companyId ? await getEmployees(user.companyId) : [];

  return (
    <div className="min-h-screen bg-background">
      <HrisHeader companyName={companyName} userName={user.name} />

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

        {/* Employee Directory and Dashboard Component */}
        <EmployeeDirectory initialEmployees={employeesList} companyId={user.companyId || ""} />
      </main>
    </div>
  );
}
