import * as React from "react";
import {
  HiOutlineArrowRight,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { AppCardItem } from "../types/apps.types";

export function AppsGrid({ apps }: { apps: AppCardItem[] }) {
  return (
    <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {apps.map((app) => {
        const Icon = app.icon;
        const isActive = app.status === "active";
        const isRestricted = app.status === "restricted";

        if (isActive) {
          return (
            <li key={app.id}>
              <a
                href={app.href}
                aria-label={`${app.name}: ${app.description}`}
                className="group relative flex h-full flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:bg-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {app.name}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {app.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3 text-xs font-semibold text-primary">
                  <span>{app.statusLabel}</span>
                  <HiOutlineArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            </li>
          );
        }

        if (isRestricted) {
          return (
            <li key={app.id}>
              <div
                role="article"
                aria-disabled="true"
                aria-label={`${app.name}: Access Restricted`}
                className="relative flex h-full flex-col justify-between rounded-xl border border-dashed border-amber-500/30 bg-card/60 p-5 opacity-90 backdrop-blur-[2px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <HiOutlineLockClosed className="size-5" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                      <HiOutlineLockClosed className="size-3" />
                      Restricted
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-base font-bold text-foreground">
                    {app.name}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {app.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 border-t border-border/40 pt-3 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <HiOutlineLockClosed className="size-3.5" />
                  <span>{app.statusLabel}</span>
                </div>
              </div>
            </li>
          );
        }

        return (
          <li key={app.id}>
            <div
              role="article"
              aria-disabled="true"
              aria-label={`${app.name}: Coming Soon`}
              className="relative flex h-full flex-col justify-between rounded-xl border border-dashed border-border/80 bg-card/40 p-5 opacity-75"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-muted text-muted-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border/60 bg-secondary/30 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
                <h2 className="mt-4 font-display text-base font-bold text-foreground/80">
                  {app.name}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/80">
                  {app.description}
                </p>
              </div>

              <div className="mt-5 border-t border-border/40 pt-3 text-xs font-medium text-muted-foreground">
                <span>{app.statusLabel}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
