import Link from "next/link";
import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-16 max-w-200 items-center justify-between px-4 md:max-w-360 md:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-primary"
        >
          Dalia{" "}
          <span className="text-sm font-bold text-muted-foreground">HRIS</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <a
            href="#pricing"
            className="font-display hidden text-sm font-bold text-muted-foreground hover:text-primary sm:inline"
          >
            Pricing
          </a>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "font-display",
            )}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "font-display",
            )}
          >
            Start workspace
          </Link>
        </nav>
      </div>
    </header>
  );
}
