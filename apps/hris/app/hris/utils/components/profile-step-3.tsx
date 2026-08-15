import * as React from "react";
import { Label } from "@repo/ui/components/atoms/Label";
import { Input } from "@repo/ui/components/atoms/Input";
import { HiOutlineBriefcase } from "react-icons/hi2";

interface Step3Props {
  employee: any;
  taxTypes: any[];
}

export function ProfileStep3({ employee, taxTypes }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <HiOutlineBriefcase className="size-5 text-primary" />
          <h4 className="font-display font-bold text-foreground">3. Employment & Job Details</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" defaultValue={employee.department || ""} placeholder="e.g. Engineering" />
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" name="jobTitle" defaultValue={employee.jobTitle || ""} placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <Label htmlFor="responsibilityCenter">Responsibility Center</Label>
            <Input id="responsibilityCenter" name="responsibilityCenter" defaultValue={employee.responsibilityCenter || ""} />
          </div>
          <div>
            <Label htmlFor="dateOfHire">Date of Hire</Label>
            <Input id="dateOfHire" name="dateOfHire" type="date" defaultValue={employee.dateOfHire ? employee.dateOfHire.split("T")[0] : ""} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="employmentStatus">Status</Label>
            <select
              id="employmentStatus"
              name="employmentStatus"
              defaultValue={employee.employmentStatus || "Regular"}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none cursor-pointer"
            >
              <option value="Probation">Probation</option>
              <option value="Regular">Regular</option>
              <option value="Part-time">Part-time</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>
          <div>
            <Label htmlFor="employmentSchedule">Schedule</Label>
            <Input id="employmentSchedule" name="employmentSchedule" defaultValue={employee.employmentSchedule || ""} placeholder="e.g. Full-time" />
          </div>
          <div>
            <Label htmlFor="supervisorId">Supervisor ID (Optional)</Label>
            <Input id="supervisorId" name="supervisorId" defaultValue={employee.supervisorId || ""} placeholder="Supervisor Emp ID" />
          </div>
          <div>
            <Label htmlFor="taxTypeId">Tax Bracket/Type</Label>
            <select
              id="taxTypeId"
              name="taxTypeId"
              defaultValue={employee.taxTypeId || ""}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none cursor-pointer"
            >
              <option value="">Exempt / None</option>
              {taxTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
