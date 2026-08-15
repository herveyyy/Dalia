"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineCreditCard,
  HiOutlinePhone,
} from "react-icons/hi2";
import { ProfileViewer } from "@repo/ui/components/organisms/ProfileViewer";
import { useEmployeeProfileEditor } from "./employee-profile-editor.hooks";
import { ProfileStep1 } from "./profile-step-1";
import { ProfileStep2 } from "./profile-step-2";
import { ProfileStep3 } from "./profile-step-3";
import { ProfileStep4 } from "./profile-step-4";
import { ProfileStep5 } from "./profile-step-5";

interface EmployeeProfileEditorProps {
  employee: any;
  companyId: string;
  allowanceTypes: any[];
  branches: any[];
  departments: any[];
  taxTypes: any[];
  isEditMode: boolean;
}

export default function EmployeeProfileEditor({
  employee,
  companyId,
  allowanceTypes,
  branches,
  departments,
  taxTypes,
  isEditMode,
}: EmployeeProfileEditorProps) {
  const {
    currentStep,
    isPending,
    allowances,
    setAllowances,
    deductions,
    setDeductions,
    handleNextStep,
    handlePrevStep,
    handleCancel,
    handleSubmit,
  } = useEmployeeProfileEditor(employee, companyId, allowanceTypes);

  const getInputValue = (id: string): string => {
    if (typeof document === "undefined") return "";
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    return el ? el.value : "";
  };

  if (!isEditMode) {
    const initials = `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase();
    const router = useRouter();

    return (
      <div className="max-w-4xl mx-auto mt-8">
        <ProfileViewer
          title={`${employee.firstName} ${employee.lastName}`}
          initials={initials}
          statusBadge={
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                employee.employmentStatus === "Resigned"
                  ? "bg-red-500/10 text-red-600"
                  : "bg-emerald-500/10 text-emerald-600"
              }`}
            >
              {employee.employmentStatus}
            </span>
          }
          subtitle={`${employee.jobTitle || "No Title"} · ${employee.department || "No Department"}`}
          onBack={() => router.push("/hris")}
          onEdit={() => router.push(`/hris/employee/${employee.id}/profile?edit=true`)}
          sections={[
            {
              title: "Personal & Statutory Details",
              icon: <HiOutlineUser className="size-5 text-primary" />,
              fields: [
                { label: "Employee ID", value: employee.employeeNo },
                { label: "Gender", value: employee.gender },
                {
                  label: "Date of Birth",
                  value: employee.dateOfBirth
                    ? new Date(employee.dateOfBirth).toLocaleDateString("en-PH", { dateStyle: "long" })
                    : "—",
                },
                { label: "Phone Number", value: employee.phoneNumber },
                { label: "Personal Email", value: employee.personalEmail },
                { label: "Work Email", value: employee.workEmail },
                { label: "Residential Address", value: employee.residentialAddress },
                { label: "TIN", value: employee.tin },
                { label: "PhilHealth", value: employee.philhealth },
                { label: "PAG-IBIG MID", value: employee.pagIbig },
                { label: "SSS No.", value: employee.sssNo },
              ],
            },
            {
              title: "Employment & Job Details",
              icon: <HiOutlineBriefcase className="size-5 text-primary" />,
              fields: [
                { label: "Department", value: employee.department },
                { label: "Job Title", value: employee.jobTitle },
                { label: "Schedule", value: employee.employmentSchedule },
                {
                  label: "Date of Hire",
                  value: employee.dateOfHire
                    ? new Date(employee.dateOfHire).toLocaleDateString("en-PH", { dateStyle: "long" })
                    : "—",
                },
                { label: "Responsibility Center", value: employee.responsibilityCenter },
                { label: "Supervisor ID", value: employee.supervisorId },
                { label: "Tax Bracket/Type", value: employee.taxType?.name || "Exempt / None" },
              ],
            },
            {
              title: "Payroll & Bank Details",
              icon: <HiOutlineCreditCard className="size-5 text-primary" />,
              fields: [
                { label: "Pay Type", value: employee.payType },
                {
                  label: "Base Pay Rate",
                  value: `₱${parseFloat(employee.basePayRate || "0").toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}`,
                },
                { label: "Pay Frequency", value: employee.payFrequency },
                { label: "Leave Balance", value: `${employee.leaveBalanceDays || "0.00"} Days` },
                { label: "Bank Name", value: employee.bankName },
                { label: "Bank Account Number", value: employee.bankAccountNumber },
                { label: "BRSTN / Bank Code", value: employee.brstnBankCode },
              ],
            },
            {
              title: "Emergency & Adjustments",
              icon: <HiOutlinePhone className="size-5 text-primary" />,
              customContent: (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-medium">Emergency Contact</span>
                    {employee.emergencyContacts?.[0] ? (
                      <div className="mt-1">
                        <span className="font-semibold text-foreground">
                          {employee.emergencyContacts[0].contactPerson} ({employee.emergencyContacts[0].relationship})
                        </span>
                        <span className="text-muted-foreground block mt-0.5">
                          Phone: {employee.emergencyContacts[0].contactNo}
                        </span>
                        {employee.emergencyContacts[0].contactAddress && (
                          <span className="text-muted-foreground block mt-0.5">
                            Address: {employee.emergencyContacts[0].contactAddress}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">None configured</span>
                    )}
                  </div>
                  <div className="border-t border-border/40 my-1 pt-1" />
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Allowances ({employee.allowances?.length || 0})
                    </span>
                    {!employee.allowances || employee.allowances.length === 0 ? (
                      <span className="text-muted-foreground italic">None configured</span>
                    ) : (
                      <div className="mt-1 space-y-1">
                        {employee.allowances.map((a: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between font-semibold text-foreground bg-muted/30 px-2 py-0.5 rounded"
                          >
                            <span>
                              {a.allowanceType?.name || a.name} {a.allowanceType?.isTaxable ? "(Tax)" : ""}
                            </span>
                            <span>
                              ₱{parseFloat(a.amount || "0").toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border/40 my-1 pt-1" />
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Deductions ({employee.deductions?.length || 0})
                    </span>
                    {!employee.deductions || employee.deductions.length === 0 ? (
                      <span className="text-muted-foreground italic">None configured</span>
                    ) : (
                      <div className="mt-1 space-y-1">
                        {employee.deductions.map((d: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between font-semibold text-foreground bg-muted/30 px-2 py-0.5 rounded"
                          >
                            <span>
                              {d.deductionType?.name || d.name} ({d.deductionType?.category || d.category})
                            </span>
                            <span>
                              ₱{parseFloat(d.amount || "0").toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-5">
        <Link
          href="/hris"
          className="inline-flex items-center justify-center rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 shadow-xs"
        >
          &larr;
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
            Edit Employee Profile
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Modify details for {employee.firstName} {employee.lastName}
          </p>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max px-2">
          {[
            { step: 1, label: "Personal Profile" },
            { step: 2, label: "Statutory IDs" },
            { step: 3, label: "Job & Payroll" },
            { step: 4, label: "Contacts & Compensation" },
            { step: 5, label: "Review & Save" },
          ].map((s, idx, arr) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-xs font-bold font-display transition-all ${
                    currentStep === s.step
                      ? "bg-primary text-primary-foreground scale-105"
                      : currentStep > s.step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.step}
                </span>
                <span
                  className={`text-xs font-semibold font-display ${
                    currentStep === s.step
                      ? "text-foreground"
                      : "text-muted-foreground font-medium"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`h-0.5 w-8 rounded-full ${
                    currentStep > s.step ? "bg-primary/30" : "bg-muted"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Editor Form Card */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <form
          onSubmit={handleSubmit}
          noValidate
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
              e.preventDefault();
            }
          }}
          className="flex flex-col min-h-0"
        >
          <div className="p-6 space-y-6">
            {/* Step 1: Personal Profile */}
            <div className={currentStep === 1 ? "animate-fadeIn" : "hidden"}>
              <ProfileStep1 employee={employee} />
            </div>

            {/* Step 2: Statutory Identifications */}
            <div className={currentStep === 2 ? "animate-fadeIn" : "hidden"}>
              <ProfileStep2 employee={employee} />
            </div>

            {/* Step 3: Employment Details */}
            <div className={currentStep === 3 ? "animate-fadeIn" : "hidden"}>
              <ProfileStep3 employee={employee} taxTypes={taxTypes} />
            </div>

            {/* Step 4: Payroll & Adjustments */}
            <div className={currentStep === 4 ? "animate-fadeIn" : "hidden"}>
              <ProfileStep4
                employee={employee}
                allowanceTypes={allowanceTypes}
                allowances={allowances}
                setAllowances={setAllowances}
                deductions={deductions}
                setDeductions={setDeductions}
              />
            </div>

            {/* Step 5: Review & Save */}
            <div className={currentStep === 5 ? "animate-fadeIn" : "hidden"}>
              <ProfileStep5
                taxTypes={taxTypes}
                allowances={allowances}
                deductions={deductions}
                getInputValue={getInputValue}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-card shrink-0">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending}>
                Back
              </Button>
            )}
            {currentStep === 1 && (
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
            )}
            {currentStep < 5 && (
              <Button key="next-step-btn" type="button" onClick={handleNextStep}>
                Next
              </Button>
            )}
            {currentStep === 5 && (
              <Button key="save-profile-btn" type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Record"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
