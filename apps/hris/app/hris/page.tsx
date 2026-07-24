import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCompanyRecord } from "./utils/queries/employee-queries";
import { getEmployees } from "./utils/queries/employee-queries";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Dalia HRIS
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your team, approve time logs, and process Philippine statutory payroll.
        </p>
      </div>

      {/* Employee Directory and Dashboard Component */}
      <EmployeeDirectory initialEmployees={employeesList} companyId={user.companyId || ""} />
    </div>
  );
}
