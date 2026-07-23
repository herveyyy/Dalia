import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

export interface SidebarItemProps extends React.ComponentProps<"a"> {
  label: string;
  Icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
}

export function SidebarItem({
  className,
  label,
  Icon,
  isActive,
  badge,
  ...props
}: SidebarItemProps) {
  return (
    <a
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 select-none cursor-pointer",
        isActive
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      <span className="flex-1 tracking-wide">{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-bold leading-none tracking-wide",
            isActive
              ? "bg-primary-foreground text-primary"
              : "bg-muted-foreground/15 text-muted-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </a>
  );
}
