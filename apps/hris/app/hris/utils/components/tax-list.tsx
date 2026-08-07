"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@repo/ui/components/atoms/Table";
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
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalculator,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
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
  totalCount: number;
  companyId: string;
  page?: number;
  itemsPerPage?: number;
  search?: string;
}

export function TaxList({
  taxTypes,
  totalCount,
  companyId,
  page = 1,
  itemsPerPage = 10,
  search: initialSearch = "",
}: TaxListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxTypeRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("rows");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("employee_table_hris");
        if (saved === "column") setViewMode("grid");
        else setViewMode("rows");
      } catch (e) {}
    }
  }, []);

  const updateQueryParams = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    router.push(`/hris/taxes?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ q: searchValue, page: 1 });
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <HiOutlineCalculator className="size-7 text-primary" />
            Tax Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure custom tax rates and tax categories for company payroll calculations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle onViewChange={(mode) => setViewMode(mode || "rows")} />
          <Button onClick={() => handleOpenDialog(null)} className="gap-2 font-display">
            <HiOutlinePlus className="size-4" /> Add Tax Type
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar UI */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border/60">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tax types..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 text-xs"
          />
        </form>
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{taxTypes.length}</span> of{" "}
          <span className="font-semibold text-foreground">{totalCount}</span> entries
        </div>
      </div>

      {/* Tax Table / Grid */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taxTypes.map((tax) => (
            <div key={tax.id} className="border border-border/60 rounded-xl bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground">{tax.name}</h3>
                  <p className="text-xs text-muted-foreground">{tax.description || "No description"}</p>
                </div>
                <span className="font-mono font-bold text-primary text-base">{tax.rate}%</span>
              </div>
              <div className="flex justify-end gap-1 pt-2 border-t border-border/40">
                <Button variant="ghost" size="xs" onClick={() => handleOpenDialog(tax)}>
                  <HiOutlinePencil className="size-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="xs" onClick={() => handleDelete(tax.id)} className="text-destructive">
                  <HiOutlineTrash className="size-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tax Name</TableHead>
                <TableHead>Rate (%)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxTypes.length === 0 ? (
                <TableEmpty colSpan={4}>
                  <div className="flex flex-col items-center gap-2">
                    <p>No tax types found.</p>
                    <Button onClick={() => handleOpenDialog(null)} size="sm" variant="outline" className="mt-2">
                      Add First Tax Type
                    </Button>
                  </div>
                </TableEmpty>
              ) : (
                taxTypes.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell className="font-semibold text-foreground">{tax.name}</TableCell>
                    <TableCell className="font-mono font-medium text-foreground">{tax.rate}%</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{tax.description || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleOpenDialog(tax)}
                        >
                          <HiOutlinePencil className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleDelete(tax.id)}
                          className="hover:text-destructive"
                        >
                          <HiOutlineTrash className="size-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <DataPagination
        totalItems={totalCount}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        navigate={(href) => router.push(href, { scroll: false })}
      />

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
                <DialogTitle>{selectedTax ? "Edit Tax Type" : "Add Tax Type"}</DialogTitle>
                <DialogDescription>
                  Configure the tax name, percentage rate, and optional description.
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-card shrink-0">
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
