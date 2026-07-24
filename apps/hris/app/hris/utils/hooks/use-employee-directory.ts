"use client";

import { useState, useTransition } from "react";
import { saveEmployee, deleteEmployee } from "../actions/employee-actions";

export function useEmployeeDirectory(initialEmployees: any[], companyId: string) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "employees">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

    // Dialog & Form state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Dynamic form rows
  const [allowances, setAllowances] = useState<any[]>([]);
  const [deductions, setDeductions] = useState<any[]>([]);

  // Open modal for Create/Edit
  const handleOpenDialog = (emp: any | null = null) => {
    setCurrentStep(1);
    setSelectedEmployee(emp);
    if (emp) {
      setAllowances(
        emp.allowances?.map((a: any) => ({
          name: a.allowanceType?.name || "",
          amount: a.amount,
          isTaxable: a.allowanceType?.isTaxable || false,
          frequency: a.frequency || "monthly",
        })) || []
      );
      setDeductions(
        emp.deductions?.map((d: any) => ({
          name: d.deductionType?.name || "",
          amount: d.amount,
          category: d.deductionType?.category || "voluntary",
          frequency: d.frequency || "every_pay_period",
        })) || []
      );
    } else {
      setAllowances([]);
      setDeductions([
        { name: "SSS", amount: "0.00", category: "statutory", frequency: "every_pay_period" },
        { name: "PhilHealth", amount: "0.00", category: "statutory", frequency: "every_pay_period" },
        { name: "Pag-IBIG", amount: "0.00", category: "statutory", frequency: "every_pay_period" },
      ]);
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedEmployee(null);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const firstNameInput = document.getElementById("firstName") as HTMLInputElement;
      const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
      if (firstNameInput && !firstNameInput.value.trim()) {
        firstNameInput.reportValidity();
        return;
      }
      if (lastNameInput && !lastNameInput.value.trim()) {
        lastNameInput.reportValidity();
        return;
      }
    }
    if (currentStep === 3) {
      const basePayRateInput = document.getElementById("basePayRate") as HTMLInputElement;
      if (basePayRateInput && !basePayRateInput.value.trim()) {
        basePayRateInput.reportValidity();
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      id: selectedEmployee?.id || null,
      companyId,
      employeeNo: formData.get("employeeNo"),
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      suffix: formData.get("suffix"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      personalEmail: formData.get("personalEmail"),
      workEmail: formData.get("workEmail"),
      phoneNumber: formData.get("phoneNumber"),
      residentialAddress: formData.get("residentialAddress"),
      tin: formData.get("tin"),
      philhealth: formData.get("philhealth"),
      pagIbig: formData.get("pagIbig"),
      sssNo: formData.get("sssNo"),
      philIdNo: formData.get("philIdNo"),
      department: formData.get("department"),
      jobTitle: formData.get("jobTitle"),
      responsibilityCenter: formData.get("responsibilityCenter"),
      employmentStatus: formData.get("employmentStatus"),
      employmentSchedule: formData.get("employmentSchedule"),
      supervisorId: formData.get("supervisorId") || null,
      dateOfHire: formData.get("dateOfHire"),
      payType: formData.get("payType"),
      basePayRate: formData.get("basePayRate"),
      payFrequency: formData.get("payFrequency"),
      bankName: formData.get("bankName"),
      bankAccountNumber: formData.get("bankAccountNumber"),
      brstnBankCode: formData.get("brstnBankCode"),
      totalRegularHours: formData.get("totalRegularHours"),
      overtimeHours: formData.get("overtimeHours"),
      leaveBalanceDays: formData.get("leaveBalanceDays"),
      taxBracketCode: formData.get("taxBracketCode"),
      
      emergencyContact: {
        contactPerson: formData.get("contactPerson"),
        contactNo: formData.get("contactNo"),
        contactAddress: formData.get("contactAddress"),
        relationship: formData.get("relationship"),
      },
      
      allowances,
      deductions,
    };

    startTransition(async () => {
      const res = await saveEmployee(payload);
      if (res.success) {
        handleCloseDialog();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      startTransition(async () => {
        await deleteEmployee(id);
      });
    }
  };

  // Filtered list
  const filteredEmployees = initialEmployees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      (emp.employeeNo && emp.employeeNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isPending,
    isOpen,
    setIsOpen,
    selectedEmployee,
    setSelectedEmployee,
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
  };
}
