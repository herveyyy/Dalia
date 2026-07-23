"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/molecules/Card";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiOutlineHome,
  HiOutlineEnvelopeOpen,
  HiPlus,
} from "react-icons/hi2";
import { useWorkspace } from "./utils/context/workspace-context";

export default function WorkspacePage() {
  const { activeWorkspace, openCreateDialog } = useWorkspace();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            {activeWorkspace?.name}
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            Client Workspace Overview & Configuration
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2 self-start font-display">
          <HiPlus className="size-4" />
          New Workspace
        </Button>
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/60 bg-card p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HiOutlineHome className="size-5" />
            </span>
            <CardTitle className="text-lg font-bold mt-3">Workspace Identity</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              General company properties and workspace indicators.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-sm space-y-2 mt-4 pt-4 border-t border-border/40">
            <div>
              <span className="text-muted-foreground font-semibold">Workspace Name:</span>
              <span className="ml-2 font-bold text-foreground">{activeWorkspace?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Workspace ID:</span>
              <span className="ml-2 font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">
                {activeWorkspace?.id}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <HiOutlineEnvelopeOpen className="size-5" />
            </span>
            <CardTitle className="text-lg font-bold mt-3">Company Admin</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Active contact role for managing company integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 text-sm space-y-2 mt-4 pt-4 border-t border-border/40">
            <div>
              <span className="text-muted-foreground font-semibold">Designated Admin:</span>
              <span className="ml-2 font-bold text-foreground">{activeWorkspace?.adminEmail}</span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Access Privilege:</span>
              <span className="ml-2 rounded bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-500 uppercase">
                Pending Invite
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
