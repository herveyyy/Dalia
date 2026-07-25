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
import { ConfirmDialog } from "@repo/ui/components/molecules/ConfirmDialog";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCalculator } from "react-icons/hi2";

import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";

interface TaxTypeRecord {
  id: string;
  name: string;
  rate: string;
  description: string | null;
}

interface TaxListProps {
  taxTypes: TaxTypeRecord[];
  companyId: string;
  page?: number;
  itemsPerPage?: number;
}

export function TaxList({
  taxTypes,
  companyId,
  page = 1,
  itemsPerPage = 20,
}: TaxListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxTypeRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [viewMode, setViewMode] = useState<"grid" | "rows" | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("employee_table_hris");
        if (saved === "row") setViewMode("rows");
        else if (saved === "column") setViewMode("grid");
        else setViewMode(null);
      } catch (e) {}
    }
  }, []);

  const totalItems = taxTypes.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedTaxes = taxTypes.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenDialog = (tax: TaxTypeRecord | null = null) => {
    setSelectedTax(tax);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedTax(null);
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
      await saveTaxType(payload);
      handleCloseDialog();
    });
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
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
        <div className="flex items-center gap-3">
          <ViewToggle onViewChange={setViewMode} />
          <Button onClick={() => handleOpenDialog(null)} className="gap-2">
            <HiOutlinePlus className="size-4" /> Add Tax Type
          </Button>
        </div>
      </div>

      {/* Tax Table */}
      {viewMode === null ? null : (
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
              <tbody className="divide-y divide-border/60 text-sm">
                {taxTypes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <p>No tax types configured.</p>
                        <Button onClick={() => handleOpenDialog(null)} size="sm" variant="outline" className="mt-2">
                          Add First Tax Type
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTaxes.map((tax) => (
                    <tr key={tax.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{tax.name}</td>
                      <td className="px-6 py-4 font-mono font-medium text-foreground">{tax.rate}%</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{tax.description || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(tax)}
                            className="h-8 px-2 text-muted-foreground"
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
      )}

      <DataPagination
        totalItems={totalItems}
        currentPage={page}
        itemsPerPage={itemsPerPage}
      />

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

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Archive Tax Setting"
        description="Are you sure you want to archive this tax configuration?"
        confirmLabel="Archive"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteTargetId) return;
          startTransition(async () => {
            await deleteTaxType(deleteTargetId);
            setDeleteTargetId(null);
          });
        }}
      />
    </div>
  );
}
