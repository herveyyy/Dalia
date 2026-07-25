import * as React from "react";
import {
  HiOutlineArrowRight,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/molecules/Card";
import { Button, buttonVariants } from "@repo/ui/components/atoms/Button";
import { cn } from "@repo/ui/lib/utils";
import { AppCardItem } from "../types/apps.types";

export function AppsGrid({ apps }: { apps: AppCardItem[] }) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => {
        const Icon = app.icon;
        const isActive = app.status === "active";
        const isRestricted = app.status === "restricted";

        return (
          <Card
            key={app.id}
            className={cn(
              "flex flex-col justify-between border border-border/60 bg-card p-6 transition-all duration-200",
              isActive
                ? "hover:border-primary/40 hover:shadow-md"
                : "opacity-80 bg-card/40 border-dashed backdrop-blur-[2px]"
            )}
          >
            <CardHeader className="p-0 gap-4">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    isActive
                      ? "bg-primary/12 text-primary"
                      : isRestricted
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isRestricted ? (
                    <HiOutlineLockClosed className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </span>
                {isRestricted && (
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.5px] text-amber-600 uppercase">
                    Restricted
                  </span>
                )}
                {!isActive && !isRestricted && (
                  <span className="rounded-full bg-secondary/15 px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.5px] text-secondary uppercase">
                    Coming Soon
                  </span>
                )}
              </div>
              <CardTitle className="font-display text-lg font-bold mt-2">
                {app.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground min-h-12">
                {app.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 mt-6 pt-0 border-t-0 bg-transparent">
              {isActive ? (
                <a
                  href={app.href}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full font-display gap-2"
                  )}
                >
                  {app.statusLabel}
                  <HiOutlineArrowRight className="size-4" />
                </a>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="w-full font-display border-dashed opacity-60 cursor-not-allowed"
                >
                  {app.statusLabel}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
