"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import {
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineCreditCard,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { ProfileViewer } from "@repo/ui/components/organisms/ProfileViewer";
import {
  useEmployeeProfileEditor,
} from "./employee-profile-editor.hooks";

interface EmployeeProfileEditorProps {
  employee: any;
  allowanceTypes: any[];
  taxTypes: any[];
  branches: any[];
  departments: any[];
  companyId: string;
  isEditMode?: boolean;
}

export function EmployeeProfileEditor({
  employee,
  allowanceTypes,
  taxTypes,
  branches,
  departments,
  companyId,
  isEditMode = true,
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
          <HiOutlineArrowLeft className="size-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Employee Directory</span>
            <span>/</span>
            <span>{employee.firstName} {employee.lastName}</span>
            <span>/</span>
            <span className="text-foreground font-medium">Edit Profile</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Edit Profile: <span className="text-primary">{employee.firstName} {employee.lastName}</span>
          </h1>
        </div>
      </div>

      {/* Wizard Progress Container */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { step: 1, label: "Personal Profile" },
            { step: 2, label: "Statutory IDs" },
            { step: 3, label: "Job & Payroll" },
            { step: 4, label: "Contacts & Compensation" },
            { step: 5, label: "Review & Save" },
          ].map((s, idx, arr) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                    currentStep === s.step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : currentStep > s.step
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.step}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    currentStep === s.step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 hidden md:block ${
                    currentStep > s.step ? "bg-primary/40" : "bg-border/60"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Editor Form Card */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
              e.preventDefault();
            }
          }}
          className="flex flex-col min-h-0"
        >
          <div className="p-6 space-y-6">
            {/* Step 1: Personal Profile */}
            <div className={currentStep === 1 ? "space-y-4 animate-fadeIn" : "hidden"}>
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <HiOutlineUser className="size-5 text-primary" />
                <h4 className="font-display font-bold text-foreground">1. Personal Profile</h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-1">
                  <Label htmlFor="employeeNo">Employee ID/No.</Label>
                  <Input id="employeeNo" name="employeeNo" defaultValue={employee.employeeNo || ""} placeholder="EMP-001" />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" defaultValue={employee.firstName || ""} required />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" name="middleName" defaultValue={employee.middleName || ""} />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" defaultValue={employee.lastName || ""} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <Label htmlFor="suffix">Suffix (Jr/III)</Label>
                  <Input id="suffix" name="suffix" defaultValue={employee.suffix || ""} placeholder="e.g. Jr." />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : ""} />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" name="gender" defaultValue={employee.gender || ""} placeholder="e.g. Female" />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" defaultValue={employee.phoneNumber || ""} placeholder="0917-xxx-xxxx" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="personalEmail">Personal Email</Label>
                  <Input id="personalEmail" name="personalEmail" type="email" defaultValue={employee.personalEmail || ""} />
                </div>
                <div>
                  <Label htmlFor="workEmail">Work Email</Label>
                  <Input id="workEmail" name="workEmail" type="email" defaultValue={employee.workEmail || ""} />
                </div>
              </div>
              <div>
                <Label htmlFor="residentialAddress">Residential Address</Label>
                <Input id="residentialAddress" name="residentialAddress" defaultValue={employee.residentialAddress || ""} />
              </div>
            </div>

            {/* Step 2: Government Identifications */}
            <div className={currentStep === 2 ? "space-y-4 animate-fadeIn" : "hidden"}>
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <HiOutlineBuildingOffice2 className="size-5 text-primary" />
                <h4 className="font-display font-bold text-foreground">2. Statutory Identifications</h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-5">
                <div>
                  <Label htmlFor="tin">TIN</Label>
                  <Input id="tin" name="tin" defaultValue={employee.tin || ""} placeholder="xxx-xxx-xxx" />
                </div>
                <div>
                  <Label htmlFor="philhealth">PhilHealth</Label>
                  <Input id="philhealth" name="philhealth" defaultValue={employee.philhealth || ""} placeholder="xx-xxxxxxxxx-x" />
                </div>
                <div>
                  <Label htmlFor="pagIbig">PAG-IBIG MID</Label>
                  <Input id="pagIbig" name="pagIbig" defaultValue={employee.pagIbig || ""} placeholder="xxxx-xxxx-xxxx" />
                </div>
                <div>
                  <Label htmlFor="sssNo">SSS No.</Label>
                  <Input id="sssNo" name="sssNo" defaultValue={employee.sssNo || ""} placeholder="xx-xxxxxxx-x" />
                </div>
                <div>
                  <Label htmlFor="philIdNo">PhilID No.</Label>
                  <Input id="philIdNo" name="philIdNo" defaultValue={employee.philIdNo || ""} placeholder="National ID" />
                </div>
              </div>
            </div>

            {/* Step 3: Job & Payroll Details */}
            <div className={currentStep === 3 ? "space-y-6 animate-fadeIn" : "hidden"}>
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
                      {taxTypes.map((tax) => (
                        <option key={tax.id} value={tax.id}>
                          {tax.name} ({tax.rate}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlineCreditCard className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">4. Payroll Configurations</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="payType">Pay Type</Label>
                    <Input id="payType" name="payType" defaultValue={employee.payType || ""} placeholder="Salaried / Hourly" />
                  </div>
                  <div>
                    <Label htmlFor="basePayRate">Base Pay Rate (₱) *</Label>
                    <Input id="basePayRate" name="basePayRate" type="number" step="0.01" defaultValue={employee.basePayRate || "0.00"} required />
                  </div>
                  <div>
                    <Label htmlFor="payFrequency">Pay Frequency</Label>
                    <Input id="payFrequency" name="payFrequency" defaultValue={employee.payFrequency || "Semi-monthly"} />
                  </div>
                  <div>
                    <Label htmlFor="leaveBalanceDays">Leave Balance (Days)</Label>
                    <Input id="leaveBalanceDays" name="leaveBalanceDays" type="number" step="0.5" defaultValue={employee.leaveBalanceDays || "0.00"} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" name="bankName" defaultValue={employee.bankName || ""} />
                  </div>
                  <div>
                    <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                    <Input id="bankAccountNumber" name="bankAccountNumber" defaultValue={employee.bankAccountNumber || ""} />
                  </div>
                  <div>
                    <Label htmlFor="brstnBankCode">BRSTN / Bank Code</Label>
                    <Input id="brstnBankCode" name="brstnBankCode" defaultValue={employee.brstnBankCode || ""} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="totalRegularHours">Total Regular Hours</Label>
                    <Input id="totalRegularHours" name="totalRegularHours" type="number" step="0.01" defaultValue={employee.totalRegularHours || "0.00"} />
                  </div>
                  <div>
                    <Label htmlFor="overtimeHours">Overtime Hours</Label>
                    <Input id="overtimeHours" name="overtimeHours" type="number" step="0.01" defaultValue={employee.overtimeHours || "0.00"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Emergency Contacts & Compensation */}
            <div className={currentStep === 4 ? "space-y-6 animate-fadeIn" : "hidden"}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlinePhone className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">5. Emergency Contact</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" name="contactPerson" defaultValue={employee.emergencyContacts?.[0]?.contactPerson || ""} />
                  </div>
                  <div>
                    <Label htmlFor="contactNo">Contact Phone No.</Label>
                    <Input id="contactNo" name="contactNo" defaultValue={employee.emergencyContacts?.[0]?.contactNo || ""} />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" name="relationship" defaultValue={employee.emergencyContacts?.[0]?.relationship || ""} placeholder="e.g. Spouse" />
                  </div>
                  <div>
                    <Label htmlFor="contactAddress">Contact Address</Label>
                    <Input id="contactAddress" name="contactAddress" defaultValue={employee.emergencyContacts?.[0]?.contactAddress || ""} />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Allowances List */}
                <div className="border border-border/60 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h5 className="font-display font-bold text-foreground">Allowances</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAllowances([...allowances, { name: "", amount: "0.00", isTaxable: false, frequency: "monthly" }])}
                      className="h-8 gap-1 text-xs"
                    >
                      <HiOutlinePlus className="size-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-62.5 overflow-y-auto pr-1">
                    {allowances.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No allowances configured.</p>
                    ) : (
                      allowances.map((alw, index) => {
                        const isCustom = alw.isCustom || (alw.name && !allowanceTypes.some((t) => t.name === alw.name));
                        return (
                          <div key={index} className="flex gap-2 items-center">
                            <select
                              value={allowanceTypes.some((t) => t.name === alw.name) ? alw.name : alw.name ? "__custom__" : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newAlw = [...allowances];
                                const item = newAlw[index];
                                if (item) {
                                  if (val === "__custom__") {
                                    item.name = "";
                                    item.isCustom = true;
                                  } else {
                                    item.name = val;
                                    item.isCustom = false;
                                    const matched = allowanceTypes.find((t) => t.name === val);
                                    if (matched) {
                                      item.isTaxable = matched.isTaxable;
                                    }
                                  }
                                }
                                setAllowances(newAlw);
                              }}
                              className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none w-44 cursor-pointer"
                              required
                            >
                              <option value="">Select Type...</option>
                              {allowanceTypes.map((t) => (
                                <option key={t.id} value={t.name}>
                                  {t.name}
                                </option>
                              ))}
                              <option value="__custom__">+ Custom Type...</option>
                            </select>

                            {isCustom && (
                              <Input
                                placeholder="Custom Name"
                                value={alw.name}
                                onChange={(e) => {
                                  const newAlw = [...allowances];
                                  const item = newAlw[index];
                                  if (item) {
                                    item.name = e.target.value;
                                  }
                                  setAllowances(newAlw);
                                }}
                                className="text-xs"
                                required
                              />
                            )}

                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Amount"
                              className="w-24 text-right"
                              value={alw.amount}
                              onChange={(e) => {
                                const newAlw = [...allowances];
                                const item = newAlw[index];
                                if (item) {
                                  item.amount = e.target.value;
                                }
                                setAllowances(newAlw);
                              }}
                              required
                            />
                            <select
                              value={alw.isTaxable ? "true" : "false"}
                              onChange={(e) => {
                                const newAlw = [...allowances];
                                const item = newAlw[index];
                                if (item) {
                                  item.isTaxable = e.target.value === "true";
                                }
                                setAllowances(newAlw);
                              }}
                              disabled={!isCustom && allowanceTypes.some((t) => t.name === alw.name)}
                              className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none disabled:opacity-60 cursor-pointer"
                            >
                              <option value="false">Non-Tax</option>
                              <option value="true">Taxable</option>
                            </select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setAllowances(allowances.filter((_, i) => i !== index))}
                              className="text-muted-foreground hover:text-destructive h-8 px-2 shrink-0"
                            >
                              <HiOutlineTrash className="size-4" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Deductions List */}
                <div className="border border-border/60 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h5 className="font-display font-bold text-foreground">Deductions</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeductions([...deductions, { name: "", amount: "0.00", category: "voluntary", frequency: "every_pay_period" }])}
                      className="h-8 gap-1 text-xs"
                    >
                      <HiOutlinePlus className="size-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-62.5 overflow-y-auto pr-1">
                    {deductions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No deductions configured.</p>
                    ) : (
                      deductions.map((ded, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Deduction Name"
                            value={ded.name}
                            onChange={(e) => {
                              const newDed = [...deductions];
                              const item = newDed[index];
                              if (item) {
                                item.name = e.target.value;
                              }
                              setDeductions(newDed);
                            }}
                            required
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount"
                            className="w-24 text-right"
                            value={ded.amount}
                            onChange={(e) => {
                              const newDed = [...deductions];
                              const item = newDed[index];
                              if (item) {
                                item.amount = e.target.value;
                              }
                              setDeductions(newDed);
                            }}
                            required
                          />
                          <select
                            value={ded.category}
                            onChange={(e) => {
                              const newDed = [...deductions];
                              const item = newDed[index];
                              if (item) {
                                item.category = e.target.value;
                              }
                              setDeductions(newDed);
                            }}
                            className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none cursor-pointer"
                          >
                            <option value="statutory">Statutory</option>
                            <option value="voluntary">Voluntary</option>
                          </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeductions(deductions.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive h-8 px-2 shrink-0"
                          >
                            <HiOutlineTrash className="size-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Review & Save */}
            <div className={currentStep === 5 ? "space-y-6 animate-fadeIn" : "hidden"}>
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
                        {taxTypes.find(t => t.id === getInputValue("taxTypeId"))?.name || "Exempt / None"}
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
                      <span className="text-muted-foreground block font-medium">Allowances ({allowances.filter(a => a.name).length})</span>
                      {allowances.filter(a => a.name).length === 0 ? (
                        <span className="text-muted-foreground italic">None configured</span>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {allowances.filter(a => a.name).map((a, i) => (
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
                      <span className="text-muted-foreground block font-medium">Deductions ({deductions.filter(d => d.name).length})</span>
                      {deductions.filter(d => d.name).length === 0 ? (
                        <span className="text-muted-foreground italic">None configured</span>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {deductions.filter(d => d.name).map((d, i) => (
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
            <Button
              type={currentStep < 5 ? "button" : "submit"}
              onClick={currentStep < 5 ? handleNextStep : undefined}
              disabled={isPending}
              key="primary-action-btn"
            >
              {currentStep < 5 ? "Next" : isPending ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
