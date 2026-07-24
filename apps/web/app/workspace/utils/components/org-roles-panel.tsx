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
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineShieldCheck } from "react-icons/hi2";
import { deleteRoleAction, saveRoleAction } from "../actions/org-actions";
import type { WorkspaceRole } from "../queries/get/get-org.query";

interface OrgRolesPanelProps {
  companyId: string;
  companyName: string;
  roles: WorkspaceRole[];
}

export function OrgRolesPanel({ companyId, companyName, roles }: OrgRolesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<WorkspaceRole | null>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = (role: WorkspaceRole | null = null) => {
    setSelected(role);
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
      await saveRoleAction({
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Roles</h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Custom roles for{" "}
            <span className="font-semibold text-foreground">{companyName}</span>. Assign them to
            employees from the Employees page.
          </p>
        </div>
        <Button onClick={() => openDialog(null)} className="gap-2 self-start">
          <HiOutlinePlus className="size-4" />
          Add Role
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {roles.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <HiOutlineShieldCheck className="mx-auto size-8 opacity-50" />
              <p className="mt-2">No roles yet. Create roles the firm can assign to people.</p>
            </div>
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-muted/30"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">{role.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {role.description || "No description"}
                    {role.isSystem ? " · System" : " · Custom"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openDialog(role)}>
                    <HiOutlinePencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={role.isSystem}
                    onClick={() => {
                      if (confirm("Delete this role?")) {
                        startTransition(async () => {
                          await deleteRoleAction(role.id, companyId);
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-md">
            <DialogTitle>{selected ? "Edit Role" : "Add Role"}</DialogTitle>
            <DialogDescription>
              Firm-defined roles for this client company (e.g. Manager, Bookkeeper).
            </DialogDescription>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
