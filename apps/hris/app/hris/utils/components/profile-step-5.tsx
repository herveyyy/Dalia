import * as React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import type { AllowanceRecord, DeductionRecord } from "./employee-profile-editor.hooks";

interface Step5Props {
  taxTypes: any[];
  allowances: AllowanceRecord[];
  deductions: DeductionRecord[];
  getInputValue: (id: string) => string;
}

export function ProfileStep5({
  taxTypes,
  allowances,
  deductions,
  getInputValue,
}: Step5Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <HiOutlineCheckCircle className="size-5 text-primary" />
        <h4 className="font-display font-bold text-foreground">5. Review Employee Profile Details</h4>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Panel 1: Personal & Statutory Info */}
        <div className="border border-border/60 rounded-xl p-4 bg-muted/5 space-y-3">
          <h5 className="font-display font-bold text-xs text-primary uppercase tracking-wider">Personal & Statutory Info</h5>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Employee ID</span>
              <span className="font-semibold text-foreground">{getInputValue("employeeNo") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Full Name</span>
              <span className="font-semibold text-foreground">
                {getInputValue("firstName")} {getInputValue("middleName")} {getInputValue("lastName")} {getInputValue("suffix")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Date of Birth</span>
              <span className="font-semibold text-foreground">{getInputValue("dateOfBirth") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Gender</span>
              <span className="font-semibold text-foreground">{getInputValue("gender") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Personal Email</span>
              <span className="font-semibold text-foreground">{getInputValue("personalEmail") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Work Email</span>
              <span className="font-semibold text-foreground">{getInputValue("workEmail") || "—"}</span>
            </div>
            <div className="col-span-2 border-t border-border/40 my-1 pt-1" />
            <div>
              <span className="text-muted-foreground block">TIN</span>
              <span className="font-semibold text-foreground">{getInputValue("tin") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">PhilHealth</span>
              <span className="font-semibold text-foreground">{getInputValue("philhealth") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">PAG-IBIG MID</span>
              <span className="font-semibold text-foreground">{getInputValue("pagIbig") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">SSS No.</span>
              <span className="font-semibold text-foreground">{getInputValue("sssNo") || "—"}</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Job & Schedule Details */}
        <div className="border border-border/60 rounded-xl p-4 bg-muted/5 space-y-3">
          <h5 className="font-display font-bold text-xs text-primary uppercase tracking-wider">Employment & Job Details</h5>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Department</span>
              <span className="font-semibold text-foreground">{getInputValue("department") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Job Title</span>
              <span className="font-semibold text-foreground">{getInputValue("jobTitle") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Schedule</span>
              <span className="font-semibold text-foreground">{getInputValue("employmentSchedule") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Date of Hire</span>
              <span className="font-semibold text-foreground">{getInputValue("dateOfHire") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Employment Status</span>
              <span className="font-semibold text-foreground">{getInputValue("employmentStatus") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Supervisor ID</span>
              <span className="font-semibold text-foreground">{getInputValue("supervisorId") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Responsibility Center</span>
              <span className="font-semibold text-foreground">{getInputValue("responsibilityCenter") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Tax Type</span>
              <span className="font-semibold text-foreground">
                {taxTypes.find((t) => t.id === getInputValue("taxTypeId"))?.name || "Exempt / None"}
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Payroll & Compensation */}
        <div className="border border-border/60 rounded-xl p-4 bg-muted/5 space-y-3">
          <h5 className="font-display font-bold text-xs text-primary uppercase tracking-wider">Payroll & Compensation</h5>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Pay Type</span>
              <span className="font-semibold text-foreground">{getInputValue("payType") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Base Pay Rate</span>
              <span className="font-bold text-emerald-600">
                ₱{parseFloat(getInputValue("basePayRate") || "0").toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Pay Frequency</span>
              <span className="font-semibold text-foreground">{getInputValue("payFrequency") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Leave Balance (Days)</span>
              <span className="font-semibold text-foreground">{getInputValue("leaveBalanceDays") || "0.0"}</span>
            </div>
            <div className="col-span-2 border-t border-border/40 my-1 pt-1" />
            <div>
              <span className="text-muted-foreground block">Bank Name</span>
              <span className="font-semibold text-foreground">{getInputValue("bankName") || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Bank Account Number</span>
              <span className="font-semibold text-foreground">{getInputValue("bankAccountNumber") || "—"}</span>
            </div>
          </div>
        </div>

        {/* Panel 4: Emergency Contacts & Adjustments */}
        <div className="border border-border/60 rounded-xl p-4 bg-muted/5 space-y-3">
          <h5 className="font-display font-bold text-xs text-primary uppercase tracking-wider">Emergency & Adjustments</h5>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground block font-medium">Emergency Contact</span>
              <span className="font-semibold text-foreground">
                {getInputValue("contactPerson")} ({getInputValue("relationship")}) · {getInputValue("contactNo")}
              </span>
              {getInputValue("contactAddress") && (
                <span className="text-muted-foreground block mt-0.5">{getInputValue("contactAddress")}</span>
              )}
            </div>
            <div className="border-t border-border/40 my-1 pt-1" />
            <div>
              <span className="text-muted-foreground block font-medium">Allowances ({allowances.filter((a) => a.name).length})</span>
              {allowances.filter((a) => a.name).length === 0 ? (
                <span className="text-muted-foreground italic">None configured</span>
              ) : (
                <div className="mt-1 space-y-1">
                  {allowances.filter((a) => a.name).map((a, i) => (
                    <div key={i} className="flex justify-between font-semibold text-foreground bg-background/50 px-2 py-0.5 rounded">
                      <span>{a.name} {a.isTaxable ? "(Tax)" : ""}</span>
                      <span>₱{parseFloat(a.amount || "0").toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-border/40 my-1 pt-1" />
            <div>
              <span className="text-muted-foreground block font-medium">Deductions ({deductions.filter((d) => d.name).length})</span>
              {deductions.filter((d) => d.name).length === 0 ? (
                <span className="text-muted-foreground italic">None configured</span>
              ) : (
                <div className="mt-1 space-y-1">
                  {deductions.filter((d) => d.name).map((d, i) => (
                    <div key={i} className="flex justify-between font-semibold text-foreground bg-background/50 px-2 py-0.5 rounded">
                      <span>{d.name} ({d.category})</span>
                      <span>₱{parseFloat(d.amount || "0").toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
