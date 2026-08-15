import * as React from "react";
import { Label } from "@repo/ui/components/atoms/Label";
import { Input } from "@repo/ui/components/atoms/Input";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiOutlineCreditCard,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import type { AllowanceRecord, DeductionRecord } from "./employee-profile-editor.hooks";

interface Step4Props {
  employee: any;
  allowanceTypes: any[];
  allowances: AllowanceRecord[];
  setAllowances: React.Dispatch<React.SetStateAction<AllowanceRecord[]>>;
  deductions: DeductionRecord[];
  setDeductions: React.Dispatch<React.SetStateAction<DeductionRecord[]>>;
}

export function ProfileStep4({
  employee,
  allowanceTypes,
  allowances,
  setAllowances,
  deductions,
  setDeductions,
}: Step4Props) {
  return (
    <div className="space-y-6">
      {/* Part A: Payroll & Bank Details */}
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
      </div>

      {/* Part B: Emergency Contacts */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <HiOutlinePhone className="size-5 text-primary" />
          <h4 className="font-display font-bold text-foreground">5. Emergency Contact</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="contactPerson">Contact Person Name</Label>
            <Input id="contactPerson" name="contactPerson" defaultValue={employee.emergencyContacts?.[0]?.contactPerson || ""} />
          </div>
          <div>
            <Label htmlFor="relationship">Relationship</Label>
            <Input id="relationship" name="relationship" defaultValue={employee.emergencyContacts?.[0]?.relationship || ""} />
          </div>
          <div>
            <Label htmlFor="contactNo">Contact Phone No.</Label>
            <Input id="contactNo" name="contactNo" defaultValue={employee.emergencyContacts?.[0]?.contactNo || ""} />
          </div>
        </div>
        <div>
          <Label htmlFor="contactAddress">Contact Residential Address</Label>
          <Input id="contactAddress" name="contactAddress" defaultValue={employee.emergencyContacts?.[0]?.contactAddress || ""} />
        </div>
      </div>

      {/* Part C: Allowances & Deductions */}
      <div className="grid gap-6 md:grid-cols-2 pt-2">
        {/* Allowances list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Allowances</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAllowances([...allowances, { name: "", amount: "", isTaxable: false, frequency: "monthly" }])}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <HiOutlinePlus className="size-3.5" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {allowances.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">No allowances configured</span>
            ) : (
              allowances.map((alw, index) => {
                const matchedType = allowanceTypes.find((t) => t.name === alw.name);
                const isCustom = alw.isCustom || (!matchedType && alw.name !== "");

                return (
                  <div key={index} className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/40">
                    <select
                      value={isCustom ? "__custom__" : alw.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newAlw = [...allowances];
                        const item = newAlw[index];
                        if (item) {
                          if (val === "__custom__") {
                            item.name = "";
                            item.isCustom = true;
                          } else {
                            const found = allowanceTypes.find((t) => t.name === val);
                            item.name = val;
                            item.isTaxable = found?.isTaxable || false;
                            item.isCustom = false;
                          }
                        }
                        setAllowances(newAlw);
                      }}
                      className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none cursor-pointer grow shrink-0 min-w-0"
                      required
                    >
                      <option value="">Select Allowance Type...</option>
                      {allowanceTypes.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} {t.isTaxable ? "(Tax)" : ""}
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
                        className="text-xs shrink min-w-0"
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
                    <div className="flex items-center gap-1.5 shrink-0 px-1">
                      <input
                        type="checkbox"
                        id={`alw-taxable-${index}`}
                        checked={alw.isTaxable}
                        onChange={(e) => {
                          const newAlw = [...allowances];
                          const item = newAlw[index];
                          if (item) {
                            item.isTaxable = e.target.checked;
                          }
                          setAllowances(newAlw);
                        }}
                        className="size-3.5 rounded border-input text-primary cursor-pointer"
                      />
                      <label htmlFor={`alw-taxable-${index}`} className="text-[10px] text-muted-foreground select-none cursor-pointer">
                        Tax
                      </label>
                    </div>
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

        {/* Deductions list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Deductions</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeductions([...deductions, { name: "", amount: "", category: "voluntary", frequency: "every_pay_period" }])}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <HiOutlinePlus className="size-3.5" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {deductions.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">No deductions configured</span>
            ) : (
              deductions.map((ded, index) => (
                <div key={index} className="flex gap-2 items-center bg-muted/20 p-2 rounded-xl border border-border/40">
                  <Input
                    placeholder="Deduction Name"
                    className="grow shrink min-w-0"
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
                    className="h-10 rounded-lg border border-input bg-card px-2 text-xs outline-none cursor-pointer shrink-0"
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
  );
}
