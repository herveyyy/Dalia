"use client";

import { signOut } from "@repo/auth/client";
import { Button } from "@repo/ui/components/atoms/Button";
import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

interface HrisHeaderProps {
  companyName?: string | null;
  userName: string;
}

export function HrisHeader({ companyName, userName }: HrisHeaderProps) {
  const handleLogout = async () => {
    await signOut();
    // Redirecting back to the main zone login page
    window.location.href = "/login";
  };

  return (
    <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <a href="/apps" className="font-display text-xl font-bold tracking-tight text-primary hover:opacity-85">
            Dalia
          </a>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <span className="text-sm font-semibold text-foreground">
            {companyName || userName}
          </span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            HRIS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Logged in as <span className="font-medium text-foreground">{userName}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 font-display text-muted-foreground hover:text-destructive"
          >
            <HiOutlineArrowLeftOnRectangle className="size-4" />
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
