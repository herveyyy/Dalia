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
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineMapPin } from "react-icons/hi2";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";
import { ConfirmDialog } from "@repo/ui/components/molecules/ConfirmDialog";
import { deleteBranchAction, saveBranchAction } from "../actions/org-actions";
import { useListControls } from "../hooks/use-list-controls";
import type { BranchWithEmployees } from "../queries/get/get-org.query";

interface OrgBranchesPanelProps {
  companyId: string;
  companyName: string;
  branches: BranchWithEmployees[];
}

const VIEW_STORAGE_KEY = "workspace_branches_table";

export function OrgBranchesPanel({
  companyId,
  companyName,
  branches,
}: OrgBranchesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<BranchWithEmployees | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BranchWithEmployees | null>(null);
  const [isPending, startTransition] = useTransition();
  const { page, itemsPerPage, viewMode, setViewMode, navigate } = useListControls({
    storageKey: VIEW_STORAGE_KEY,
  });

  const totalItems = branches.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedBranches = branches.slice(startIndex, startIndex + itemsPerPage);

  const openDialog = (branchObj: BranchWithEmployees | null = null) => {
    setSelected(branchObj);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSelected(null);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveBranchAction({
        id: selected?.id || null,
        companyId,
        name: String(formData.get("name") || ""),
        code: String(formData.get("code") || "") || null,
        address: String(formData.get("address") || "") || null,
        description: String(formData.get("description") || "") || null,
      });
      closeDialog();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Branches & Locations
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Operating locations for{" "}
            <span className="font-semibold text-foreground">{companyName}</span>, with employees
            tagged under each branch.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle
            storageKey={VIEW_STORAGE_KEY}
            currentView={viewMode}
            onViewChange={setViewMode}
          />
          <Button onClick={() => openDialog(null)} className="gap-2 self-start font-display">
            <HiOutlinePlus className="size-4" />
            Add Branch
          </Button>
        </div>
      </div>

      {viewMode === null ? null : branches.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
          <HiOutlineMapPin className="mx-auto size-8 opacity-50" />
          <p className="mt-2">No branches yet. Create your first branch or store location.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedBranches.map((b) => (
            <div
              key={b.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-base font-bold text-foreground truncate">{b.name}</h2>
                    {b.code ? (
                      <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {b.code}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {b.address || b.description || "No address"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openDialog(b)}>
                    <HiOutlinePencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(b)}>
                    <HiOutlineTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {b.employees.length} employee{b.employees.length === 1 ? "" : "s"}
                </p>
                <div className="mt-2 space-y-1.5">
                  {b.employees.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No employees tagged</p>
                  ) : (
                    b.employees.slice(0, 4).map((emp) => (
                      <p key={emp.id} className="text-sm font-medium text-foreground truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                    ))
                  )}
                  {b.employees.length > 4 ? (
                    <p className="text-xs text-muted-foreground">+{b.employees.length - 4} more</p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedBranches.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">{b.name}</h2>
                    {b.code && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {b.code}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.address || b.description || "No address"} · {b.employees.length} employee
                    {b.employees.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openDialog(b)}>
                    <HiOutlinePencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(b)}
                  >
                    <HiOutlineTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-border">
                {b.employees.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-muted-foreground">
                    No employees tagged to this branch yet. Tag employees under Employee management.
                  </p>
                ) : (
                  b.employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/30"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {emp.workEmail || emp.jobTitle || "—"}
                        </p>
                      </div>
                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                        {emp.department?.name || emp.role?.name || emp.jobTitle || "Active"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalItems > 0 ? (
        <DataPagination
          totalItems={totalItems}
          currentPage={page}
          itemsPerPage={itemsPerPage}
          navigate={navigate}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Archive Branch"
        description={`Are you sure you want to archive "${deleteTarget?.name}"?`}
        confirmLabel="Archive"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          startTransition(async () => {
            await deleteBranchAction(deleteTarget.id, companyId);
            setDeleteTarget(null);
          });
        }}
      />

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
              <DialogTitle>{selected ? "Edit Branch" : "Add Branch / Location"}</DialogTitle>
              <DialogDescription>
                Define internal store locations, offices, or regional branches.
              </DialogDescription>
            </div>

            <form key={selected?.id || "new"} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. BGC Store / Main Office" defaultValue={selected?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Branch Code (Optional)</Label>
                  <Input id="code" name="code" placeholder="e.g. BGC-01" defaultValue={selected?.code || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address / Location</Label>
                  <Input id="address" name="address" placeholder="e.g. Bonifacio Global City, Taguig" defaultValue={selected?.address || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Notes / Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="e.g. Main retail flagship store"
                    defaultValue={selected?.description || ""}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Save Branch"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
