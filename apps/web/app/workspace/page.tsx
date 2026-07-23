"use client";

import * as React from "react";
import { AppShell } from "@repo/ui/components/organisms/AppShell";
import { CreateWorkspaceDialog } from "@repo/ui/components/molecules/CreateWorkspaceDialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/molecules/Card";
import { Button } from "@repo/ui/components/atoms/Button";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineFolderOpen,
  HiOutlineEnvelopeOpen,
  HiPlus,
} from "react-icons/hi2";

// Define mock data for workspaces
const initialWorkspaces = [
  { id: "1", name: "Dalia Firm (Internal)", adminEmail: "partner@dalia.ph" },
  { id: "2", name: "Acme Logistics Inc.", adminEmail: "ceo@acmelogistics.com" },
  { id: "3", name: "Greenfield Bakery", adminEmail: "manager@greenfield.ph" },
];

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = React.useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState("1");
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  // Define sidebar navigation groups
  const navGroups = [
    {
      title: "Navigation",
      items: [
        { label: "Dashboard", href: "/workspace", Icon: HiOutlineHome, isActive: true },
        { label: "Client Database", href: "#", Icon: HiOutlineFolderOpen },
      ],
    },
    {
      title: "Statutory Tools",
      items: [
        { label: "BIR Filing Alphalist", href: "#", Icon: HiOutlineShieldCheck },
        { label: "SSS/HDMF Contributions", href: "#", Icon: HiOutlineClock },
      ],
    },
    {
      title: "Team & Staff",
      items: [
        { label: "Manage Partners", href: "#", Icon: HiOutlineUserGroup },
      ],
    },
  ];

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
  };

  const handleCreateWorkspace = (data: { name: string; adminEmail: string }) => {
    const newWorkspace = {
      id: String(workspaces.length + 1),
      name: data.name,
      adminEmail: data.adminEmail,
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  return (
    <AppShell
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspaceId}
      onSelectWorkspace={handleSelectWorkspace}
      onCreateWorkspaceClick={() => setCreateDialogOpen(true)}
      navGroups={navGroups}
      user={{
        name: "Hervey Mapa",
        email: "hervey@dalia.ph",
      }}
      onLogoutClick={() => console.log("Logout triggered")}
    >
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
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 self-start font-display">
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

        {/* Workspace creation dialog */}
        <CreateWorkspaceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreate={handleCreateWorkspace}
        />
      </div>
    </AppShell>
  );
}
