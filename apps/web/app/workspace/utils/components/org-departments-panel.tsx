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
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { ConfirmDialog } from "@repo/ui/components/molecules/ConfirmDialog";
import { deleteDepartmentAction, saveDepartmentAction } from "../actions/org-actions";
import type { DepartmentWithEmployees } from "../queries/get/get-org.query";

interface OrgDepartmentsPanelProps {
  companyId: string;
  companyName: string;
  departments: DepartmentWithEmployees[];
}

export function OrgDepartmentsPanel({
  companyId,
  companyName,
  departments,
}: OrgDepartmentsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DepartmentWithEmployees | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DepartmentWithEmployees | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (dept: DepartmentWithEmployees | null = null) => {
    setSelected(dept);
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
      await saveDepartmentAction({
        id: selected?.id || null,
        companyId,
        name: String(formData.get("name") || ""),
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
            Departments
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Org units for{" "}
            <span className="font-semibold text-foreground">{companyName}</span>, with employees
            nested under each department.
          </p>
        </div>
        <Button onClick={() => openDialog(null)} className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Add Department
        </Button>
      </div>

      {departments.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
          <HiOutlineBuildingOffice2 className="mx-auto size-8 opacity-50" />
          <p className="mt-2">No departments yet. Create one, then assign employees to it.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">{dept.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dept.description || "No description"} · {dept.employees.length} employee
                    {dept.employees.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openDialog(dept)}>
                    <HiOutlinePencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(dept)}
                  >
                    <HiOutlineTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-border">
                {dept.employees.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-muted-foreground">
                    No employees assigned. Use Employees to assign someone here.
                  </p>
                ) : (
                  dept.employees.map((emp) => (
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
                        {emp.role?.name || emp.jobTitle || "No role"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Archive Department"
        description={`Are you sure you want to archive "${deleteTarget?.name}"? Employees tagged to this department will not be deleted.`}
        confirmLabel="Archive"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          startTransition(async () => {
            await deleteDepartmentAction(deleteTarget.id, companyId);
            setDeleteTarget(null);
          });
        }}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-md">
            <DialogTitle>{selected ? "Edit Department" : "Add Department"}</DialogTitle>
            <DialogDescription>
              Departments group employees for this client company.
            </DialogDescription>
            <form key={selected?.id || "new"} onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required defaultValue={selected?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={selected?.description || ""}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
