"use client";

import * as React from "react";
import Link from "next/link";
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
} from "react-icons/hi2";
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
                      defaultValue={employee.employmentStatus || "Active"}
                      className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Resigned">Resigned</option>
                      <option value="Terminated">Terminated</option>
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
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Record"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
