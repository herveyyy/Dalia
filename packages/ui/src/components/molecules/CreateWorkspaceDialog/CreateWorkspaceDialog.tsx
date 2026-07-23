import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../atoms/Dialog";
import { Button } from "../../atoms/Button";
import { Label } from "../../atoms/Label";
import { Input } from "../../atoms/Input";

export interface CreateWorkspaceDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (data: { name: string; adminEmail: string }) => void;
}

export function CreateWorkspaceDialog({
  trigger,
  open,
  onOpenChange,
  onCreate,
}: CreateWorkspaceDialogProps) {
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName || !adminEmail) return;

    onCreate({ name: workspaceName, adminEmail });
    setWorkspaceName("");
    setAdminEmail("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle>Create Company Workspace</DialogTitle>
            <DialogClose className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer outline-none">
              <X className="size-5" />
            </DialogClose>
          </div>
          <DialogDescription>
            Accounting firm partners can configure dedicated workspaces for client companies. Setting up a workspace invites the company administrator (e.g. CEO or Department Head) directly.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Company Name</Label>
              <Input
                id="workspace-name"
                placeholder="e.g. Acme Corporation"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin / CEO Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="e.g. ceo@acme.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <DialogClose className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 h-10 text-sm font-bold text-foreground hover:bg-muted transition-all cursor-pointer">
                Cancel
              </DialogClose>
              <Button type="submit">Create Workspace</Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
