"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/atoms/Dialog";
import { saveTaxType, deleteTaxType } from "../actions/tax-actions";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCalculator } from "react-icons/hi2";

interface TaxTypeRecord {
  id: string;
  name: string;
  rate: string;
  description: string | null;
}

interface TaxListProps {
  taxTypes: TaxTypeRecord[];
  companyId: string;
}

export function TaxList({ taxTypes, companyId }: TaxListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxTypeRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenDialog = (tax: TaxTypeRecord | null = null) => {
    setSelectedTax(tax);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedTax(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: selectedTax?.id || null,
      companyId,
      name: formData.get("name") as string,
      rate: formData.get("rate") as string,
      description: formData.get("description") as string,
    };

    startTransition(async () => {
      const res = await saveTaxType(payload);
      if (res.success) {
        handleCloseDialog();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to archive this tax type?")) {
      startTransition(async () => {
        await deleteTaxType(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Tax Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure custom tax rates and tax categories for company payroll calculations.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog(null)} className="gap-2">
          <HiOutlinePlus className="size-4" /> Add Tax Type
        </Button>
      </div>

      {/* Tax Table */}
      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Tax Name</th>
                <th className="px-6 py-4">Rate (%)</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm text-foreground">
              {taxTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineCalculator className="size-8 text-muted-foreground/60" />
                      <p>No tax types configured yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                taxTypes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold">{tax.name}</td>
                    <td className="px-6 py-4">{tax.rate}%</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {tax.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(tax)}
                          className="h-8 px-2"
                        >
                          <HiOutlinePencil className="size-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tax.id)}
                          className="h-8 px-2 hover:text-destructive text-muted-foreground"
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

      {/* Dialog for Add/Edit */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-2xl">
              <DialogTitle>{selectedTax ? "Edit Tax Type" : "Add Tax Type"}</DialogTitle>
              <DialogDescription>
                Configure the tax name, percentage rate, and optional description.
              </DialogDescription>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Tax Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedTax?.name || ""}
                    placeholder="e.g. Withholding Tax (20%)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Rate (%) *</Label>
                  <Input
                    id="rate"
                    name="rate"
                    type="number"
                    step="0.01"
                    defaultValue={selectedTax?.rate || "0.00"}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    defaultValue={selectedTax?.description || ""}
                    placeholder="e.g. Expanded withholding tax bracket"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                  <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Tax Type"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}
