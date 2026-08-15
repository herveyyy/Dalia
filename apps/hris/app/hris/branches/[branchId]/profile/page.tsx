import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as React from "react";
import { HiOutlineBuildingOffice2, HiOutlineUserGroup } from "react-icons/hi2";
import { getBranchDetailsById } from "../../../utils/queries/employee-queries";
import { ProfileViewer } from "@repo/ui/components/organisms/ProfileViewer";

interface Props {
  params: Promise<{ branchId: string }>;
}

export default async function BranchProfilePage({ params }: Props) {
  const { branchId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const br = await getBranchDetailsById(branchId);
  if (!br) redirect("/hris/branches");

  const initials = (br.name?.[0] || "B").toUpperCase();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <ProfileViewer
        title={br.name}
        subtitle="Location / branch profile"
        initials={initials}
        statusBadge={
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
            {br.employees.length} Employee{br.employees.length === 1 ? "" : "s"}
          </span>
        }
        onBack={async () => {
          "use server";
          redirect("/hris/branches");
        }}
        sections={[
          {
            title: "Location Details",
            icon: <HiOutlineBuildingOffice2 className="size-5 text-primary" />,
            fields: [
              { label: "Branch Name", value: br.name },
              { label: "Created At", value: br.createdAt ? new Date(br.createdAt).toLocaleDateString("en-PH", { dateStyle: "long" }) : "—" },
            ],
          },
          {
            title: "Assigned Employees",
            icon: <HiOutlineUserGroup className="size-5 text-primary" />,
            customContent: (
              <div className="space-y-2">
                {br.employees.length === 0 ? (
                  <span className="text-muted-foreground italic text-xs">No employees assigned to this location</span>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {br.employees.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-xl border border-border/20 text-xs"
                      >
                        <div>
                          <span className="block text-xs text-foreground font-bold">
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">
                            {emp.jobTitle || "No Title"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {emp.workEmail || emp.personalEmail || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
