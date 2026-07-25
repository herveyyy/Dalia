import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../../atoms/Dialog";
import { Button } from "../../atoms/Button";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning" | "default";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

const variantIcons = {
  destructive: Trash2,
  warning: AlertTriangle,
  default: Info,
};

const variantBadgeStyles = {
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-600",
  default: "bg-primary/10 text-primary",
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const Icon = variantIcons[variant];

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-md">
          <div className="flex items-start gap-4">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", variantBadgeStyles[variant])}>
              <Icon className="size-5" />
            </span>
            <div className="space-y-1">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Processing…" : confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
