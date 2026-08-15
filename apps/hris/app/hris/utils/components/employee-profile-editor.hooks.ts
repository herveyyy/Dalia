import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveEmployee } from "../actions/employee-actions";

export interface AllowanceRecord {
  name: string;
  amount: string;
  isTaxable: boolean;
  frequency: string;
  isCustom?: boolean;
}

export interface DeductionRecord {
  name: string;
  amount: string;
  category: string;
  frequency: string;
}

export function useEmployeeProfileEditor(
  employee: any,
  companyId: string,
  allowanceTypes: any[]
) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Dynamic form rows
  const [allowances, setAllowances] = useState<AllowanceRecord[]>(() => {
    return (
      employee.allowances?.map((a: any) => ({
        name: a.allowanceType?.name || "",
        amount: a.amount,
        isTaxable: a.allowanceType?.isTaxable || false,
        frequency: a.frequency || "monthly",
      })) || []
    );
  });

  const [deductions, setDeductions] = useState<DeductionRecord[]>(() => {
    return (
      employee.deductions?.map((d: any) => ({
        name: d.deductionType?.name || "",
        amount: d.amount,
        category: d.deductionType?.category || "voluntary",
        frequency: d.frequency || "every_pay_period",
      })) || []
    );
  });

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

  const handleCancel = () => {
    router.push("/hris");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: employee.id,
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
      taxTypeId: formData.get("taxTypeId") || null,
      
      emergencyContact: {
        contactPerson: formData.get("contactPerson"),
        contactNo: formData.get("contactNo"),
        contactAddress: formData.get("contactAddress"),
        relationship: formData.get("relationship"),
      },
      
      allowances: allowances.filter((a) => a.name.trim() !== ""),
      deductions: deductions.filter((d) => d.name.trim() !== ""),
    };

    startTransition(async () => {
      try {
        const res = await saveEmployee(payload);
        if (res.success) {
          router.push("/hris");
        }
      } catch (err: any) {
        alert(err?.message || "An error occurred while saving.");
      }
    });
  };

  return {
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
  };
}
