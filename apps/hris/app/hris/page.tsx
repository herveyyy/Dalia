import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCompanyRecord, getEmployees, getAllowanceTypes } from "./utils/queries/employee-queries";
import { getTaxTypes } from "./utils/queries/tax-queries";
import { EmployeeDirectory } from "./utils/components/employee-directory";

export default async function Page(props: {
  searchParams?: Promise<{ page?: string; items?: string; view?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page || 1);
  const items = Number(searchParams?.items || 20);
  const viewMode = (searchParams?.view as "grid" | "rows") || "rows";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // 1. Fetch company record using query utility
  const companyRecord = user.companyId ? await getCompanyRecord(user.companyId) : null;

  // 2. Fetch employee records with pre-joined relations using query utility
  const employeesList = user.companyId ? await getEmployees(user.companyId) : [];

  // 3. Fetch allowance types and tax types
  const allowanceTypes = user.companyId ? await getAllowanceTypes(user.companyId) : [];
  const taxTypes = user.companyId ? await getTaxTypes(user.companyId) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Dalia HRIS
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your team, approve time logs, and process the Philippines statutory payroll.
        </p>
      </div>

      {/* Employee Directory and Dashboard Component */}
      <EmployeeDirectory
        initialEmployees={employeesList}
        companyId={user.companyId || ""}
        allowanceTypes={allowanceTypes}
        taxTypes={taxTypes}
        page={page}
        itemsPerPage={items}
        viewMode={viewMode}
      />
    </div>
  );
}
