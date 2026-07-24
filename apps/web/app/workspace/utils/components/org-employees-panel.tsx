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
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineKey,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import {
  assignEmployeeAction,
  deleteEmployeeAction,
  saveEmployeeAction,
} from "../actions/org-actions";
import {
  createEmployeeLoginAction,
  resetEmployeePasswordAction,
  revokeEmployeeLoginAction,
} from "../actions/employee-login-actions";
import type {
  WorkspaceBranch,
  WorkspaceDepartment,
  WorkspaceEmployee,
  WorkspaceRole,
} from "../queries/get/get-org.query";

interface OrgEmployeesPanelProps {
  companyId: string;
  companyName: string;
  employees: WorkspaceEmployee[];
  departments: WorkspaceDepartment[];
  branches: WorkspaceBranch[];
  roles: WorkspaceRole[];
}

type LoginMode = "create" | "reset" | null;

export function OrgEmployeesPanel({
  companyId,
  companyName,
  employees,
  departments,
  branches,
  roles,
}: OrgEmployeesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<WorkspaceEmployee | null>(null);
  const [loginMode, setLoginMode] = useState<LoginMode>(null);
  const [loginTarget, setLoginTarget] = useState<WorkspaceEmployee | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (employee: WorkspaceEmployee | null = null) => {
    setSelected(employee);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSelected(null);
    setIsOpen(false);
  };

  const openLogin = (employee: WorkspaceEmployee, mode: LoginMode) => {
    setLoginTarget(employee);
    setLoginMode(mode);
    setLoginError(null);
  };

  const closeLogin = () => {
    setLoginTarget(null);
    setLoginMode(null);
    setLoginError(null);
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
        branchId: String(formData.get("branchId") || "") || null,
        roleId: String(formData.get("roleId") || "") || null,
        jobTitle: String(formData.get("jobTitle") || "") || null,
        employmentStatus: String(formData.get("employmentStatus") || "Active"),
      });
      closeDialog();
    });
  };

  const handleAssign = (
    employeeId: string,
    field: "departmentId" | "branchId" | "roleId",
    value: string
  ) => {
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

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginTarget || !loginMode) return;
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") || "");
    setLoginError(null);

    startTransition(async () => {
      try {
        if (loginMode === "create") {
          await createEmployeeLoginAction({
            companyId,
            employeeId: loginTarget.id,
            password,
            email: loginTarget.workEmail,
          });
        } else {
          await resetEmployeePasswordAction({
            companyId,
            employeeId: loginTarget.id,
            password,
          });
        }
        closeLogin();
      } catch (err) {
        setLoginError(err instanceof Error ? err.message : "Failed to update login");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Employees</h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            People directory for{" "}
            <span className="font-semibold text-foreground">{companyName}</span>. Create a login so
            they can sign in at /login → /apps.
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
                <th className="px-6 py-4">Login</th>
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
                        className="w-full max-w-[160px] rounded-md border border-border bg-background px-2 py-1.5 text-sm"
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
                        className="w-full max-w-[160px] rounded-md border border-border bg-background px-2 py-1.5 text-sm"
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
                      {emp.userId ? (
                        <span className="rounded-md bg-green-500/10 px-2 py-1 text-xs font-bold text-green-700">
                          Enabled
                        </span>
                      ) : (
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                          No login
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {!emp.userId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            disabled={!emp.workEmail}
                            title={
                              emp.workEmail
                                ? "Create login"
                                : "Add a work email first"
                            }
                            onClick={() => openLogin(emp, "create")}
                          >
                            <HiOutlineKey className="size-3.5" />
                            Login
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => openLogin(emp, "reset")}
                            >
                              <HiOutlineKey className="size-3.5" />
                              Password
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Revoke login"
                              onClick={() => {
                                if (confirm(`Revoke login for ${emp.firstName}?`)) {
                                  startTransition(async () => {
                                    try {
                                      await revokeEmployeeLoginAction({
                                        companyId,
                                        employeeId: emp.id,
                                      });
                                    } catch (err) {
                                      alert(err instanceof Error ? err.message : "Revoke failed");
                                    }
                                  });
                                }
                              }}
                            >
                              <HiOutlineLockClosed className="size-4 text-destructive" />
                            </Button>
                          </>
                        )}
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

      {isOpen && (
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
                    placeholder="Required to create a login"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
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
                    <Label htmlFor="branchId">Branch / Location</Label>
                    <select
                      id="branchId"
                      name="branchId"
                      defaultValue={selected?.branchId || ""}
                      className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                    >
                      <option value="">Main Location</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
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
      )}

      {loginMode && loginTarget && (
        <Dialog open onOpenChange={(open) => !open && closeLogin()}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-md">
              <DialogTitle>
                {loginMode === "create" ? "Create employee login" : "Reset password"}
              </DialogTitle>
              <DialogDescription>
                {loginMode === "create" ? (
                  <>
                    Creates a Better Auth account for{" "}
                    <span className="font-semibold text-foreground">
                      {loginTarget.firstName} {loginTarget.lastName}
                    </span>{" "}
                    ({loginTarget.workEmail}). They sign in at /login → /apps. Their role access
                    rights apply.
                  </>
                ) : (
                  <>Set a new password for {loginTarget.workEmail}.</>
                )}
              </DialogDescription>
              <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {loginMode === "create" ? "Temporary password" : "New password"}
                  </Label>
                  <Input id="password" name="password" type="password" minLength={8} required />
                  <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
                </div>
                {loginError ? <p className="text-sm text-destructive">{loginError}</p> : null}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closeLogin}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending
                      ? "Saving…"
                      : loginMode === "create"
                        ? "Create login"
                        : "Update password"}
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
