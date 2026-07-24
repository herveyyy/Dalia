"use client";

import * as React from "react";
import { useMemo, useState, useTransition } from "react";
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
import type { AppAccessCatalog, WorkspaceRole } from "../queries/get/get-org.query";

interface OrgRolesPanelProps {
  companyId: string;
  companyName: string;
  roles: WorkspaceRole[];
  catalog: AppAccessCatalog;
}

export function OrgRolesPanel({
  companyId,
  companyName,
  roles,
  catalog,
}: OrgRolesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<WorkspaceRole | null>(null);
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const featureCountByRole = useMemo(() => {
    const map = new Map<string, number>();
    for (const role of roles) {
      map.set(role.id, role.permissions?.length ?? 0);
    }
    return map;
  }, [roles]);

  const openDialog = (role: WorkspaceRole | null = null) => {
    setSelected(role);
    setFeatureIds(role?.permissions?.map((p) => p.featureId) ?? []);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSelected(null);
    setFeatureIds([]);
    setIsOpen(false);
  };

  const toggleFeature = (featureId: string) => {
    setFeatureIds((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  const toggleApp = (appFeatureIds: string[], checked: boolean) => {
    setFeatureIds((prev) => {
      if (checked) {
        return [...new Set([...prev, ...appFeatureIds])];
      }
      return prev.filter((id) => !appFeatureIds.includes(id));
    });
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
        featureIds,
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
            <span className="font-semibold text-foreground">{companyName}</span>. Set access rights
            per app and feature.
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
              <p className="mt-2">No roles yet. Create a role and pick which apps/features it can use.</p>
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
                    {" · "}
                    {featureCountByRole.get(role.id) ?? 0} access right
                    {(featureCountByRole.get(role.id) ?? 0) === 1 ? "" : "s"}
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

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogTitle>{selected ? "Edit Role" : "Add Role"}</DialogTitle>
              <DialogDescription>
                Name the role, then grant access rights by app and feature.
              </DialogDescription>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
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

                <div className="space-y-3">
                  <div>
                    <Label>Access rights</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select features per app. New apps/features can be added to the catalog later.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {catalog.map((app) => {
                      const appFeatureIds = app.features.map((f) => f.id);
                      const selectedCount = appFeatureIds.filter((id) =>
                        featureIds.includes(id)
                      ).length;
                      const allSelected =
                        appFeatureIds.length > 0 && selectedCount === appFeatureIds.length;

                      return (
                        <div
                          key={app.id}
                          className="rounded-xl border border-border bg-muted/20 overflow-hidden"
                        >
                          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                            <div>
                              <p className="text-sm font-bold text-foreground">{app.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {app.description || app.key} · {selectedCount}/
                                {app.features.length} selected
                              </p>
                            </div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => toggleApp(appFeatureIds, e.target.checked)}
                                className="size-4 rounded border-border"
                              />
                              All
                            </label>
                          </div>
                          <div className="grid gap-2 p-3 sm:grid-cols-2">
                            {app.features.map((feature) => (
                              <label
                                key={feature.id}
                                className="flex items-start gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-sm hover:bg-card cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={featureIds.includes(feature.id)}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="mt-0.5 size-4 rounded border-border"
                                />
                                <span>
                                  <span className="font-semibold text-foreground block">
                                    {feature.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {app.key}.{feature.key}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving…" : "Save role"}
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
