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
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUserGroup } from "react-icons/hi2";
import {
  assignEmployeeAction,
  deleteEmployeeAction,
  saveEmployeeAction,
} from "../actions/org-actions";
import type {
  WorkspaceDepartment,
  WorkspaceEmployee,
  WorkspaceRole,
} from "../queries/get/get-org.query";

interface OrgEmployeesPanelProps {
  companyId: string;
  companyName: string;
  employees: WorkspaceEmployee[];
  departments: WorkspaceDepartment[];
  roles: WorkspaceRole[];
}

export function OrgEmployeesPanel({
  companyId,
  companyName,
  employees,
  departments,
  roles,
}: OrgEmployeesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<WorkspaceEmployee | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (employee: WorkspaceEmployee | null = null) => {
    setSelected(employee);
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
      await saveEmployeeAction({
        id: selected?.id || null,
        companyId,
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        workEmail: String(formData.get("workEmail") || "") || null,
        departmentId: String(formData.get("departmentId") || "") || null,
        roleId: String(formData.get("roleId") || "") || null,
        jobTitle: String(formData.get("jobTitle") || "") || null,
        employmentStatus: String(formData.get("employmentStatus") || "Active"),
      });
      closeDialog();
    });
  };

  const handleAssign = (employeeId: string, field: "departmentId" | "roleId", value: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;
    startTransition(async () => {
      await assignEmployeeAction({
        employeeId,
        companyId,
        departmentId: field === "departmentId" ? value || null : employee.departmentId,
        roleId: field === "roleId" ? value || null : employee.roleId,
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Employees</h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            People directory for{" "}
            <span className="font-semibold text-foreground">{companyName}</span>. Assign department
            and role from the list.
          </p>
        </div>
        <Button onClick={() => openDialog(null)} className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Add Employee
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <HiOutlineUserGroup className="size-8 opacity-50" />
                      <p>No employees yet. Add someone to assign to a department or role.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{emp.workEmail || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        className="w-full max-w-45 rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                        value={emp.departmentId || ""}
                        disabled={isPending}
                        onChange={(e) => handleAssign(emp.id, "departmentId", e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="w-full max-w-45 rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                        value={emp.roleId || ""}
                        disabled={isPending}
                        onChange={(e) => handleAssign(emp.id, "roleId", e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => openDialog(emp)}>
                          <HiOutlinePencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            if (confirm("Remove this employee?")) {
                              startTransition(async () => {
                                await deleteEmployeeAction(emp.id, companyId);
                              });
                            }
                          }}
                        >
                          <HiOutlineTrash className="size-4 text-destructive" />
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-lg">
            <DialogTitle>{selected ? "Edit Employee" : "Add Employee"}</DialogTitle>
            <DialogDescription>
              Create or update a person for this client company, then assign department and role.
            </DialogDescription>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    defaultValue={selected?.firstName || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    defaultValue={selected?.lastName || ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEmail">Work email</Label>
                <Input
                  id="workEmail"
                  name="workEmail"
                  type="email"
                  defaultValue={selected?.workEmail || ""}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department</Label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    defaultValue={selected?.departmentId || ""}
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleId">Role</Label>
                  <select
                    id="roleId"
                    name="roleId"
                    defaultValue={selected?.roleId || ""}
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    defaultValue={selected?.jobTitle || ""}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Status</Label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    defaultValue={selected?.employmentStatus || "Active"}
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
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
