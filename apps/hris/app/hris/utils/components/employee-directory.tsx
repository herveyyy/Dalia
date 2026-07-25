"use client";

import * as React from "react";

import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogPortal, DialogOverlay } from "@repo/ui/components/atoms/Dialog";
import {
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalculator,
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineCreditCard,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineUser,
} from "react-icons/hi2";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";
import { useEmployeeDirectory } from "../hooks/use-employee-directory";

interface EmployeeDirectoryProps {
  initialEmployees: any[];
  companyId: string;
  allowanceTypes: any[];
  taxTypes: any[];
  page?: number;
  itemsPerPage?: number;
  viewMode?: "grid" | "rows";
}

export function EmployeeDirectory({
  initialEmployees,
  companyId,
  allowanceTypes,
  taxTypes,
  page = 1,
  itemsPerPage = 20,
  viewMode = "rows",
}: EmployeeDirectoryProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isPending,
    isOpen,
    setIsOpen,
    selectedEmployee,
    allowances,
    setAllowances,
    deductions,
    setDeductions,
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
    filteredEmployees,
    currentStep,
    handleNextStep,
    handlePrevStep,
  } = useEmployeeDirectory(initialEmployees, companyId);

  const totalItems = filteredEmployees.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mt-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-border/60 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-display text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "dashboard"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-2 font-display text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "employees"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Employee Directory ({initialEmployees.length})
        </button>
      </div>

      {activeTab === "dashboard" ? (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-border/60 bg-card p-6 rounded-xl shadow-sm hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Active Employees
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">
                    {initialEmployees.filter((e) => e.employmentStatus === "Active").length}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {initialEmployees.filter((e) => e.payType === "Salaried").length} salaried ·{" "}
                    {initialEmployees.filter((e) => e.payType === "Hourly").length} hourly
                  </p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-xl text-blue-500 bg-blue-500/10 shrink-0">
                  <HiOutlineUserGroup className="size-6" />
                </span>
              </div>
            </div>

            <div className="border border-border/60 bg-card p-6 rounded-xl shadow-sm hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Allowances
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">
                    ₱
                    {initialEmployees
                      .reduce(
                        (sum, e) =>
                          sum +
                          e.allowances.reduce((acc: number, al: any) => acc + parseFloat(al.amount || "0"), 0),
                        0
                      )
                      .toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Monthly company budget</p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-xl text-emerald-500 bg-emerald-500/10 shrink-0">
                  <HiOutlineClock className="size-6" />
                </span>
              </div>
            </div>

            <div className="border border-border/60 bg-card p-6 rounded-xl shadow-sm hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Deductions
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">
                    ₱
                    {initialEmployees
                      .reduce(
                        (sum, e) =>
                          sum +
                          e.deductions.reduce((acc: number, de: any) => acc + parseFloat(de.amount || "0"), 0),
                        0
                      )
                      .toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Statutory & Voluntary</p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-xl text-amber-500 bg-amber-500/10 shrink-0">
                  <HiOutlineCalculator className="size-6" />
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Calculations Info Panel */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="col-span-2 border border-border/60 bg-card p-6 rounded-xl shadow-sm">
              <h3 className="font-display text-lg font-bold">Statutory Payroll Calculator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Verify deduction tables compliance and automatically compute SSS, PhilHealth, Pag-IBIG contributions.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-dashed border-border p-4 bg-muted/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">2026 Statutory Updates</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      All calculations comply with current updates.
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                    <HiOutlineCheckCircle className="size-3.5" /> Compliant
                  </span>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      SSS Contribution Share
                    </span>
                    <span className="mt-1 font-display text-lg font-bold text-foreground block">
                      9.5% ER · 4.5% EE
                    </span>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      PhilHealth Contribution Share
                    </span>
                    <span className="mt-1 font-display text-lg font-bold text-foreground block">
                      2.5% ER · 2.5% EE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="border border-border/60 bg-card p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">HR Quick Actions</h3>
                <p className="text-sm text-muted-foreground mt-1">Direct access to common tasks.</p>
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => {
                      setActiveTab("employees");
                      handleOpenDialog();
                    }}
                    className="w-full gap-2 font-display"
                  >
                    <HiOutlinePlus className="size-4" /> Add New Employee
                  </Button>
                  <Button
                    onClick={() => setActiveTab("employees")}
                    variant="outline"
                    className="w-full gap-2 font-display"
                  >
                    View Directory
                  </Button>
                </div>
              </div>
              <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground text-center">
                Dalia HRIS · Compliance Automated
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search employees by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <ViewToggle currentView={viewMode} />
              <Button onClick={() => handleOpenDialog()} className="gap-2 font-display">
                <HiOutlinePlus className="size-4" /> Add Employee
              </Button>
            </div>
          </div>

          {/* Directory Table */}
          <div className="overflow-hidden border border-border/60 rounded-xl bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department & Title</th>
                    <th className="px-6 py-4">Status & Type</th>
                    <th className="px-6 py-4">Pay Details</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <HiOutlineUserGroup className="size-8 opacity-50" />
                          <p>No matching employee records found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold text-foreground block">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5 block">
                              {emp.employeeNo || "No Employee ID"} · {emp.personalEmail || emp.workEmail || "No Email"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-medium text-foreground block">{emp.jobTitle || "—"}</span>
                            <span className="text-xs text-muted-foreground mt-0.5 block">{emp.department || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                emp.employmentStatus === "Active"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {emp.employmentStatus}
                            </span>
                            <span className="text-xs text-muted-foreground">{emp.employmentSchedule || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-medium text-foreground block">
                              ₱{parseFloat(emp.basePayRate).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5 block">
                              {emp.payType} · {emp.payFrequency}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(emp)}
                              className="size-8 p-0"
                              title="Edit Employee"
                            >
                              <HiOutlinePencilSquare className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(emp.id)}
                              className="size-8 p-0 text-muted-foreground hover:text-destructive"
                              title="Delete Employee"
                            >
                              <HiOutlineTrash className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <DataPagination
            totalItems={totalItems}
            currentPage={page}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Dialog for Add/Edit */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <DialogTitle>{selectedEmployee ? "Edit Employee Record" : "Add New Employee"}</DialogTitle>
            <DialogDescription>
              Configure the employee profile, identification codes, payroll settings, and emergency contacts.
            </DialogDescription>

            {/* Step Wizard Progress Bar */}
            <div className="mt-6 border-b border-border/60 pb-5">
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Step 1: Personal Profile */}
              <div className={currentStep === 1 ? "space-y-4" : "hidden"}>
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlineUser className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">1. Personal Profile</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-1">
                    <Label htmlFor="employeeNo">Employee ID/No.</Label>
                    <Input id="employeeNo" name="employeeNo" defaultValue={selectedEmployee?.employeeNo || ""} placeholder="EMP-001" />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" defaultValue={selectedEmployee?.firstName || ""} required />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" name="middleName" defaultValue={selectedEmployee?.middleName || ""} />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" defaultValue={selectedEmployee?.lastName || ""} required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="suffix">Suffix (Jr/III)</Label>
                    <Input id="suffix" name="suffix" defaultValue={selectedEmployee?.suffix || ""} placeholder="e.g. Jr." />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={selectedEmployee?.dateOfBirth ? selectedEmployee.dateOfBirth.split("T")[0] : ""} />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" name="gender" defaultValue={selectedEmployee?.gender || ""} placeholder="e.g. Female" />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" defaultValue={selectedEmployee?.phoneNumber || ""} placeholder="0917-xxx-xxxx" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="personalEmail">Personal Email</Label>
                    <Input id="personalEmail" name="personalEmail" type="email" defaultValue={selectedEmployee?.personalEmail || ""} />
                  </div>
                  <div>
                    <Label htmlFor="workEmail">Work Email</Label>
                    <Input id="workEmail" name="workEmail" type="email" defaultValue={selectedEmployee?.workEmail || ""} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="residentialAddress">Residential Address</Label>
                  <Input id="residentialAddress" name="residentialAddress" defaultValue={selectedEmployee?.residentialAddress || ""} />
                </div>
              </div>

              {/* Step 2: Government Identifications */}
              <div className={currentStep === 2 ? "space-y-4" : "hidden"}>
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlineBuildingOffice2 className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">2. Statutory Identifications</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-5">
                  <div>
                    <Label htmlFor="tin">TIN</Label>
                    <Input id="tin" name="tin" defaultValue={selectedEmployee?.tin || ""} placeholder="xxx-xxx-xxx" />
                  </div>
                  <div>
                    <Label htmlFor="philhealth">PhilHealth</Label>
                    <Input id="philhealth" name="philhealth" defaultValue={selectedEmployee?.philhealth || ""} placeholder="xx-xxxxxxxxx-x" />
                  </div>
                  <div>
                    <Label htmlFor="pagIbig">PAG-IBIG MID</Label>
                    <Input id="pagIbig" name="pagIbig" defaultValue={selectedEmployee?.pagIbig || ""} placeholder="xxxx-xxxx-xxxx" />
                  </div>
                  <div>
                    <Label htmlFor="sssNo">SSS No.</Label>
                    <Input id="sssNo" name="sssNo" defaultValue={selectedEmployee?.sssNo || ""} placeholder="xx-xxxxxxx-x" />
                  </div>
                  <div>
                    <Label htmlFor="philIdNo">PhilID No.</Label>
                    <Input id="philIdNo" name="philIdNo" defaultValue={selectedEmployee?.philIdNo || ""} placeholder="National ID" />
                  </div>
                </div>
              </div>

              {/* Step 3: Job & Payroll Details */}
              <div className={currentStep === 3 ? "space-y-6" : "hidden"}>
                {/* Group: Job Info */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlineBriefcase className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">3. Employment & Job Details</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" defaultValue={selectedEmployee?.department || ""} placeholder="e.g. Engineering" />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" name="jobTitle" defaultValue={selectedEmployee?.jobTitle || ""} placeholder="e.g. Software Engineer" />
                  </div>
                  <div>
                    <Label htmlFor="responsibilityCenter">Responsibility Center</Label>
                    <Input id="responsibilityCenter" name="responsibilityCenter" defaultValue={selectedEmployee?.responsibilityCenter || ""} />
                  </div>
                  <div>
                    <Label htmlFor="dateOfHire">Date of Hire</Label>
                    <Input id="dateOfHire" name="dateOfHire" type="date" defaultValue={selectedEmployee?.dateOfHire ? selectedEmployee.dateOfHire.split("T")[0] : ""} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="employmentStatus">Status</Label>
                    <select
                      id="employmentStatus"
                      name="employmentStatus"
                      defaultValue={selectedEmployee?.employmentStatus || "Active"}
                      className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Resigned">Resigned</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="employmentSchedule">Schedule</Label>
                    <Input id="employmentSchedule" name="employmentSchedule" defaultValue={selectedEmployee?.employmentSchedule || ""} placeholder="e.g. Full-time" />
                  </div>
                  <div>
                    <Label htmlFor="supervisorId">Supervisor ID (Optional)</Label>
                    <Input id="supervisorId" name="supervisorId" defaultValue={selectedEmployee?.supervisorId || ""} placeholder="Supervisor Emp ID" />
                  </div>
                  <div>
                    <Label htmlFor="taxTypeId">Tax Bracket/Type</Label>
                    <select
                      id="taxTypeId"
                      name="taxTypeId"
                      defaultValue={selectedEmployee?.taxTypeId || ""}
                      className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none"
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

              {/* Group: Payroll */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlineCreditCard className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">4. Payroll Configurations</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="payType">Pay Type</Label>
                    <Input id="payType" name="payType" defaultValue={selectedEmployee?.payType || ""} placeholder="Salaried / Hourly" />
                  </div>
                  <div>
                    <Label htmlFor="basePayRate">Base Pay Rate (₱) *</Label>
                    <Input id="basePayRate" name="basePayRate" type="number" step="0.01" defaultValue={selectedEmployee?.basePayRate || "0.00"} required />
                  </div>
                  <div>
                    <Label htmlFor="payFrequency">Pay Frequency</Label>
                    <Input id="payFrequency" name="payFrequency" defaultValue={selectedEmployee?.payFrequency || "Semi-monthly"} />
                  </div>
                  <div>
                    <Label htmlFor="leaveBalanceDays">Leave Balance (Days)</Label>
                    <Input id="leaveBalanceDays" name="leaveBalanceDays" type="number" step="0.5" defaultValue={selectedEmployee?.leaveBalanceDays || "0.00"} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" name="bankName" defaultValue={selectedEmployee?.bankName || ""} />
                  </div>
                  <div>
                    <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                    <Input id="bankAccountNumber" name="bankAccountNumber" defaultValue={selectedEmployee?.bankAccountNumber || ""} />
                  </div>
                  <div>
                    <Label htmlFor="brstnBankCode">BRSTN / Bank Code</Label>
                    <Input id="brstnBankCode" name="brstnBankCode" defaultValue={selectedEmployee?.brstnBankCode || ""} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="totalRegularHours">Total Regular Hours</Label>
                    <Input id="totalRegularHours" name="totalRegularHours" type="number" step="0.01" defaultValue={selectedEmployee?.totalRegularHours || "0.00"} />
                  </div>
                  <div>
                    <Label htmlFor="overtimeHours">Overtime Hours</Label>
                    <Input id="overtimeHours" name="overtimeHours" type="number" step="0.01" defaultValue={selectedEmployee?.overtimeHours || "0.00"} />
                  </div>
                </div>
              </div>

              </div>

              {/* Step 4: Emergency Contacts & Compensation */}
              <div className={currentStep === 4 ? "space-y-6" : "hidden"}>
                {/* Group: Emergency Contacts */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <HiOutlinePhone className="size-5 text-primary" />
                  <h4 className="font-display font-bold text-foreground">5. Emergency Contact</h4>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input id="contactPerson" name="contactPerson" defaultValue={selectedEmployee?.emergencyContacts?.[0]?.contactPerson || ""} />
                  </div>
                  <div>
                    <Label htmlFor="contactNo">Contact Phone No.</Label>
                    <Input id="contactNo" name="contactNo" defaultValue={selectedEmployee?.emergencyContacts?.[0]?.contactNo || ""} />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" name="relationship" defaultValue={selectedEmployee?.emergencyContacts?.[0]?.relationship || ""} placeholder="e.g. Spouse" />
                  </div>
                  <div>
                    <Label htmlFor="contactAddress">Contact Address</Label>
                    <Input id="contactAddress" name="contactAddress" defaultValue={selectedEmployee?.emergencyContacts?.[0]?.contactAddress || ""} />
                  </div>
                </div>
              </div>

              {/* Dynamic Sections: Allowances & Deductions */}
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
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
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
                                if (val === "__custom__") {
                                  newAlw[index].name = "";
                                  newAlw[index].isCustom = true;
                                } else {
                                  newAlw[index].name = val;
                                  newAlw[index].isCustom = false;
                                  const matched = allowanceTypes.find((t) => t.name === val);
                                  if (matched) {
                                    newAlw[index].isTaxable = matched.isTaxable;
                                  }
                                }
                                setAllowances(newAlw);
                              }}
                              className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none w-44"
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
                                  newAlw[index].name = e.target.value;
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
                                newAlw[index].amount = e.target.value;
                                setAllowances(newAlw);
                              }}
                              required
                            />
                            <select
                              value={alw.isTaxable ? "true" : "false"}
                              onChange={(e) => {
                                const newAlw = [...allowances];
                                newAlw[index].isTaxable = e.target.value === "true";
                                setAllowances(newAlw);
                              }}
                              disabled={!isCustom && allowanceTypes.some((t) => t.name === alw.name)}
                              className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none disabled:opacity-60"
                            >
                              <option value="false">Non-Tax</option>
                              <option value="true">Taxable</option>
                            </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setAllowances(allowances.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive h-8 px-2"
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
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
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
                              newDed[index].name = e.target.value;
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
                              newDed[index].amount = e.target.value;
                              setDeductions(newDed);
                            }}
                            required
                          />
                          <select
                            value={ded.category}
                            onChange={(e) => {
                              const newDed = [...deductions];
                              newDed[index].category = e.target.value;
                              setDeductions(newDed);
                            }}
                            className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none"
                          >
                            <option value="statutory">Statutory</option>
                            <option value="voluntary">Voluntary</option>
                          </select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeductions(deductions.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive h-8 px-2"
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending}>
                    Back
                  </Button>
                )}
                {currentStep === 1 && (
                  <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isPending}>
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
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}
