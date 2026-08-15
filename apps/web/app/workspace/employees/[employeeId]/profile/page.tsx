import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as React from "react";
import { HiOutlineUser, HiOutlineBriefcase, HiOutlineBuildingOffice2, HiOutlinePhone } from "react-icons/hi2";
import { getEmployeeById } from "../../../../../../hris/app/hris/utils/queries/employee-queries";
import { ProfileViewer } from "@repo/ui/components/organisms/ProfileViewer";

interface Props {
  params: Promise<{ employeeId: string }>;
}

export default async function WorkspaceEmployeeProfilePage({ params }: Props) {
  const { employeeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const emp = await getEmployeeById(employeeId);
  if (!emp) redirect("/workspace/employees");

  const initials = `${emp.firstName?.[0] || ""}${emp.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <ProfileViewer
        title={`${emp.firstName} ${emp.lastName}`}
        subtitle={`${emp.jobTitle || "No Title"} · ${emp.department || "No Department"}`}
        initials={initials}
        statusBadge={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              emp.employmentStatus === "Resigned"
                ? "bg-red-500/10 text-red-600"
                : "bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {emp.employmentStatus}
          </span>
        }
        onBack={async () => {
          "use server";
          redirect("/workspace/employees");
        }}
        sections={[
          {
            title: "Personal Profile",
            icon: <HiOutlineUser className="size-5 text-primary" />,
            fields: [
              { label: "Employee ID", value: emp.employeeNo || "—" },
              { label: "Gender", value: emp.gender || "—" },
              {
                label: "Date of Birth",
                value: emp.dateOfBirth
                  ? new Date(emp.dateOfBirth).toLocaleDateString("en-PH", { dateStyle: "long" })
                  : "—",
              },
              { label: "Personal Email", value: emp.personalEmail || "—" },
              { label: "Work Email", value: emp.workEmail || "—" },
              { label: "Phone Number", value: emp.phoneNumber || "—" },
              { label: "Residential Address", value: emp.residentialAddress || "—" },
            ],
          },
          {
            title: "Employment Details",
            icon: <HiOutlineBriefcase className="size-5 text-primary" />,
            fields: [
              { label: "Department", value: emp.department || "—" },
              { label: "Job Title", value: emp.jobTitle || "—" },
              { label: "Schedule", value: emp.employmentSchedule || "—" },
              {
                label: "Date of Hire",
                value: emp.dateOfHire
                  ? new Date(emp.dateOfHire).toLocaleDateString("en-PH", { dateStyle: "long" })
                  : "—",
              },
              { label: "Responsibility Center", value: emp.responsibilityCenter || "—" },
              { label: "Supervisor ID", value: emp.supervisorId || "—" },
            ],
          },
          {
            title: "Statutory Identifications",
            icon: <HiOutlineBuildingOffice2 className="size-5 text-primary" />,
            fields: [
              { label: "TIN", value: emp.tin || "—" },
              { label: "PhilHealth", value: emp.philhealth || "—" },
              { label: "PAG-IBIG MID", value: emp.pagIbig || "—" },
              { label: "SSS No.", value: emp.sssNo || "—" },
            ],
          },
          {
            title: "Emergency Contacts",
            icon: <HiOutlinePhone className="size-5 text-primary" />,
            customContent: (
              <div className="space-y-3 text-xs">
                {emp.emergencyContacts?.[0] ? (
                  <div>
                    <span className="text-muted-foreground block font-medium">Primary Contact</span>
                    <span className="font-semibold text-foreground">
                      {emp.emergencyContacts[0].contactPerson} ({emp.emergencyContacts[0].relationship})
                    </span>
                    <span className="text-muted-foreground block mt-0.5">
                      Phone: {emp.emergencyContacts[0].contactNo}
                    </span>
                    {emp.emergencyContacts[0].contactAddress && (
                      <span className="text-muted-foreground block mt-0.5">
                        Address: {emp.emergencyContacts[0].contactAddress}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">No emergency contact configured</span>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
