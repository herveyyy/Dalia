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
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineShieldCheck, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { DataPagination } from "@repo/ui/components/molecules/DataPagination";
import { ViewToggle } from "@repo/ui/components/molecules/ViewToggle";
import { ConfirmDialog } from "@repo/ui/components/molecules/ConfirmDialog";
import { deleteRoleAction, saveRoleAction } from "../actions/org-actions";
import { useListControls } from "../hooks/use-list-controls";
import type { AppAccessCatalog, WorkspaceRole } from "../queries/get/get-org.query";

interface OrgRolesPanelProps {
  companyId: string;
  companyName: string;
  roles: WorkspaceRole[];
  catalog: AppAccessCatalog;
}

const VIEW_STORAGE_KEY = "workspace_roles_table";

export function OrgRolesPanel({
  companyId,
  companyName,
  roles,
  catalog,
}: OrgRolesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<WorkspaceRole | null>(null);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<WorkspaceRole | null>(null);
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { page, itemsPerPage, viewMode, setViewMode, navigate } = useListControls({
    storageKey: VIEW_STORAGE_KEY,
  });

  const totalItems = roles.length;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRoles = roles.slice(startIndex, startIndex + itemsPerPage);

  const featureCountByRole = useMemo(() => {
    const map = new Map<string, number>();
    for (const role of roles) {
      map.set(role.id, role.permissions?.length ?? 0);
    }
    return map;
  }, [roles]);

  const openDialog = (role: WorkspaceRole | null = null) => {
    setSelected(role);
    setErrorMessage(null);
    if (role) {
      setFeatureIds(role.permissions?.map((p) => p.featureId) ?? []);
    } else {
      setFeatureIds([]);
    }
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSelected(null);
    setErrorMessage(null);
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
    setErrorMessage(null);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      setErrorMessage("Role name is required");
      return;
    }

    startTransition(async () => {
      try {
        await saveRoleAction({
          id: selected?.id || null,
          companyId,
          name,
          description: String(formData.get("description") || "").trim() || null,
          featureIds,
        });
        closeDialog();
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to save role");
      }
    });
  };

  const handleDelete = (role: WorkspaceRole) => {
    if (role.isSystem) return;
    setDeleteRoleTarget(role);
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
        <div className="flex items-center gap-3">
          <ViewToggle
            storageKey={VIEW_STORAGE_KEY}
            currentView={viewMode}
            onViewChange={setViewMode}
          />
          <Button onClick={() => openDialog(null)} className="gap-2 self-start font-display">
            <HiOutlinePlus className="size-4" />
            Add Role
          </Button>
        </div>
      </div>

      {viewMode === null ? null : roles.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-muted-foreground">
          <HiOutlineShieldCheck className="mx-auto size-8 opacity-50 text-primary" />
          <p className="mt-2 text-sm">No roles yet. Create a role and pick which apps/features it can use.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedRoles.map((role) => (
            <div
              key={role.id}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{role.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {role.description || "No description"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openDialog(role)}
                    title="Edit role"
                  >
                    <HiOutlinePencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={role.isSystem || isPending}
                    onClick={() => handleDelete(role)}
                    title={role.isSystem ? "System roles cannot be deleted" : "Delete role"}
                  >
                    <HiOutlineTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                {featureCountByRole.get(role.id) ?? 0} access right
                {(featureCountByRole.get(role.id) ?? 0) === 1 ? "" : "s"}
                {role.isSystem ? " · System" : " · Custom"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {paginatedRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">{role.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {role.description || "No description"}
                    {" · "}
                    {featureCountByRole.get(role.id) ?? 0} access right
                    {(featureCountByRole.get(role.id) ?? 0) === 1 ? "" : "s"}
                    {role.isSystem ? " · System Role" : " · Custom Role"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openDialog(role)}
                    title="Edit role"
                  >
                    <HiOutlinePencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={role.isSystem || isPending}
                    onClick={() => handleDelete(role)}
                    title={role.isSystem ? "System roles cannot be deleted" : "Delete role"}
                  >
                    <HiOutlineTrash className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <div className="p-6 pb-4 border-b border-border shrink-0 bg-card">
              <DialogTitle>{selected ? "Edit Role" : "Add Role"}</DialogTitle>
              <DialogDescription>
                Name the role, then grant access rights by app and feature.
              </DialogDescription>

              {errorMessage && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                  <HiOutlineExclamationTriangle className="size-4 shrink-0" />
                  {errorMessage}
                </div>
              )}
            </div>

            <form
              key={selected?.id || "new-role"}
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Finance Admin, Payroll Manager"
                    defaultValue={selected?.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Optional short description of this role"
                    defaultValue={selected?.description || ""}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Access Rights</Label>
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
                          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-muted/10">
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
                              Select All
                            </label>
                          </div>
                          <div className="grid gap-2 p-3 sm:grid-cols-2">
                            {app.features.map((feature) => (
                              <label
                                key={feature.id}
                                className="flex items-start gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-sm hover:bg-card cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={featureIds.includes(feature.id)}
                                  onChange={() => toggleFeature(feature.id)}
                                  className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary"
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
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0">
                <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="font-display">
                  {isPending ? "Saving Role…" : "Save Role"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteRoleTarget)}
        onOpenChange={(open) => !open && setDeleteRoleTarget(null)}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${deleteRoleTarget?.name}"?`}
        confirmLabel="Delete Role"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => {
          if (!deleteRoleTarget) return;
          startTransition(async () => {
            await deleteRoleAction(deleteRoleTarget.id, companyId);
            setDeleteRoleTarget(null);
          });
        }}
      />
    </div>
  );
}
