"use client";

import * as React from "react";
import { HiOutlineFolderOpen, HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineArrowRight } from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { useWorkspace } from "../utils/context/workspace-context";

export default function ClientsPage() {
  const { activeWorkspace, isFirmWorkspace, workspaces, onSelectWorkspace, openCreateDialog } = useWorkspace();
  const [searchQuery, setSearchQuery] = React.useState("");

  const clientWorkspaces = React.useMemo(
    () => workspaces.filter((w) => !w.isFirm),
    [workspaces]
  );

  const filteredClients = React.useMemo(() => {
    return clientWorkspaces.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clientWorkspaces, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Client Database
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            {isFirmWorkspace ? (
              <>
                Managed client companies under{" "}
                <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
              </>
            ) : (
              <>
                Company overview & compliance records for{" "}
                <span className="font-semibold text-foreground">{activeWorkspace?.name}</span>
              </>
            )}
          </p>
        </div>
        {isFirmWorkspace && (
          <Button onClick={openCreateDialog} className="gap-2 self-start">
            <HiOutlinePlus className="size-4" />
            Add Client
          </Button>
        )}
      </div>

      {isFirmWorkspace ? (
        <>
          {/* Search bar */}
          <div className="relative max-w-sm">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 transition-colors"
            />
          </div>

          {filteredClients.length > 0 ? (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{client.adminEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-green-600">
                        Active Workspace
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectWorkspace(client.id)}
                        className="gap-1.5"
                      >
                        Enter Workspace
                        <HiOutlineArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
              <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-4">
                <HiOutlineFolderOpen className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">No clients found</h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
                Try searching for another company or add a new client to start.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Client Workspace view */
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-2">Company Configuration</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This workspace contains regulatory records for {activeWorkspace?.name}. Switch back to the Firm Panel to manage other client databases.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">Admin Contact:</span>
            <span className="text-sm font-bold text-foreground">{activeWorkspace?.adminEmail}</span>
          </div>
        </div>
      )}
    </div>
  );
}
