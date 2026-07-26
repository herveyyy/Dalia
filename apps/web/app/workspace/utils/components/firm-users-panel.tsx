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
  HiOutlineTrash,
  HiOutlineKey,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import {
  createFirmUserAction,
  deleteFirmUserAction,
  resetFirmUserPasswordAction,
  updateFirmUserRolesAction,
} from "../actions/firm-user-actions";
import type { FirmUser } from "../queries/get/get-firm-users.query";
import type { WorkspaceRole } from "../queries/get/get-org.query";

interface FirmUsersPanelProps {
  companyId: string;
  companyName: string;
  currentUserId: string;
  users: FirmUser[];
  roles: WorkspaceRole[];
}

type DialogMode = "create" | "roles" | "password" | null;

export function FirmUsersPanel({
  companyId,
  companyName,
  currentUserId,
  users,
  roles,
}: FirmUsersPanelProps) {
  const [mode, setMode] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<FirmUser | null>(null);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setSelected(null);
    setRoleIds([]);
    setError(null);
    setMode("create");
  };

  const openRoles = (user: FirmUser) => {
    setSelected(user);
    setRoleIds(user.roles.map((r) => r.id));
    setError(null);
    setMode("roles");
  };

  const openPassword = (user: FirmUser) => {
    setSelected(user);
    setError(null);
    setMode("password");
  };

  const closeDialog = () => {
    setMode(null);
    setSelected(null);
    setRoleIds([]);
    setError(null);
  };

  const toggleRole = (roleId: string) => {
    setRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        await createFirmUserAction({
          companyId,
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          password: String(formData.get("password") || ""),
          roleIds,
        });
        closeDialog();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create user");
      }
    });
  };

  const handleRoles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateFirmUserRolesAction({
          companyId,
          userId: selected.id,
          roleIds,
        });
        closeDialog();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update roles");
      }
    });
  };

  const handlePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        await resetFirmUserPasswordAction({
          companyId,
          userId: selected.id,
          password: String(formData.get("password") || ""),
        });
        closeDialog();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reset password");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Firm Users
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Create login accounts for{" "}
            <span className="font-semibold text-foreground">{companyName}</span>. They sign in at{" "}
            <span className="font-semibold text-foreground">/login</span> →{" "}
            <span className="font-semibold text-foreground">/apps</span>.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total users", value: String(users.length), sub: "Firm logins" },
          {
            label: "With roles",
            value: String(users.filter((u) => u.roles.length > 0).length),
            sub: "Access assigned",
          },
          {
            label: "Firm roles",
            value: String(roles.length),
            sub: "Available to assign",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <HiOutlineUserGroup className="size-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Team logins</h2>
        </div>
        <div className="divide-y divide-border">
          {users.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <p>No firm users yet. Add someone with email + password so they can log in.</p>
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {u.name}
                      {u.id === currentUserId ? (
                        <span className="ml-2 text-xs font-semibold text-primary">(you)</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {u.roles.length === 0
                        ? "No roles assigned"
                        : u.roles.map((r) => r.name).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openRoles(u)}>
                    <HiOutlineShieldCheck className="size-3.5" />
                    Roles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => openPassword(u)}
                  >
                    <HiOutlineKey className="size-3.5" />
                    Password
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={u.id === currentUserId || isPending}
                    onClick={() => {
                      if (confirm(`Delete login for ${u.name}?`)) {
                        startTransition(async () => {
                          try {
                            await deleteFirmUserAction({ companyId, userId: u.id });
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Delete failed");
                          }
                        });
                      }
                    }}
                  >
                    <HiOutlineTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {mode === "create" && (
        <Dialog open onOpenChange={(open) => !open && closeDialog()}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
                <DialogTitle>Add firm user</DialogTitle>
                <DialogDescription>
                  Creates a real login (email + password). They can sign in and open /apps.
                </DialogDescription>
              </div>

              <form onSubmit={handleCreate} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Temporary password</Label>
                    <Input id="password" name="password" type="password" minLength={8} required />
                    <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
                  </div>
                  <RoleChecklist roles={roles} roleIds={roleIds} onToggle={toggleRole} />
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                </div>

                <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating…" : "Create user"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}

      {mode === "roles" && selected && (
        <Dialog open onOpenChange={(open) => !open && closeDialog()}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
                <DialogTitle>Assign roles</DialogTitle>
                <DialogDescription>
                  Access rights for {selected.name}. Create more under Firm Roles.
                </DialogDescription>
              </div>

              <form onSubmit={handleRoles} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <RoleChecklist roles={roles} roleIds={roleIds} onToggle={toggleRole} />
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                </div>

                <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving…" : "Save roles"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}

      {mode === "password" && selected && (
        <Dialog open onOpenChange={(open) => !open && closeDialog()}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
              <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
                <DialogTitle>Reset password</DialogTitle>
                <DialogDescription>Set a new password for {selected.email}.</DialogDescription>
              </div>

              <form onSubmit={handlePassword} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
                    <Input id="password" name="password" type="password" minLength={8} required />
                  </div>
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                </div>

                <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving…" : "Update password"}
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

function RoleChecklist({
  roles,
  roleIds,
  onToggle,
}: {
  roles: WorkspaceRole[];
  roleIds: string[];
  onToggle: (roleId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Firm roles</Label>
      {roles.length === 0 ? (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border px-3 py-3">
          No firm roles yet. Create them under Team & Staff → Firm Roles, including app access
          rights.
        </p>
      ) : (
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={roleIds.includes(role.id)}
                onChange={() => onToggle(role.id)}
                className="mt-0.5 size-4 rounded border-border"
              />
              <span>
                <span className="font-semibold text-foreground block">{role.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {role.permissions?.length ?? 0} access rights
                  {role.description ? ` · ${role.description}` : ""}
                </span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
