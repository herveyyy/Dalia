import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import {
  getEmployeeById,
  getAllowanceTypes,
} from "../../../utils/queries/employee-queries";
import { getCompanyBranches, getCompanyDepartments } from "../../../utils/queries/job-queries";
import { EmployeeProfileEditor } from "../../../utils/components/employee-profile-editor";
import { db, taxType, eq } from "@repo/db";

export default async function EmployeeProfilePage(props: {
  params: Promise<{ employeeId: string }>;
  searchParams?: Promise<{ edit?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { employeeId } = params;
  const isEditMode = searchParams?.edit === "true";

  const session = await getSafeSession(await headers());
  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  if (!user.companyId) {
    redirect("/login");
  }

  const [employeeRecord, allowanceTypes, branches, departments, taxTypes] = await Promise.all([
    getEmployeeById(employeeId),
    getAllowanceTypes(user.companyId),
    getCompanyBranches(user.companyId),
    getCompanyDepartments(user.companyId),
    db.select().from(taxType).where(eq(taxType.companyId, user.companyId)),
  ]);

  if (!employeeRecord) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EmployeeProfileEditor
        employee={employeeRecord}
        allowanceTypes={allowanceTypes}
        taxTypes={taxTypes}
        branches={branches}
        departments={departments}
        companyId={user.companyId}
        isEditMode={isEditMode}
      />
    </div>
  );
}
