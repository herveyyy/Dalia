import Link from "next/link";
import type { ReactNode } from "react";
import {
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const highlights = [
  {
    Icon: HiOutlineShieldCheck,
    label: "Statutory compliance",
    detail: "BIR 1601-C, SSS, PhilHealth, Pag-IBIG",
  },
  {
    Icon: HiOutlineClock,
    label: "Hours back each cycle",
    detail: "Attendance in → portal-ready exports out",
  },
  {
    Icon: HiOutlineCheckBadge,
    label: "Built for firms",
    detail: "Workspace pricing that fits retainers",
  },
] as const;

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Desktop brand panel */}
      <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-12 xl:px-16">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute -top-24 -left-16 size-112 rounded-full bg-primary-container/55 blur-3xl" />
          <div className="absolute right-0 bottom-0 size-88 rounded-full bg-tertiary-container/50 blur-3xl" />
        </div>

        <Link
          href="/"
          className="font-display relative z-10 inline-flex items-center gap-2 text-xl font-bold tracking-tight text-primary"
        >
          Dalia
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
            For accounting firms
          </p>
          <h2 className="font-display mt-4 text-4xl leading-tight font-bold text-balance text-primary xl:text-5xl">
            Statutory payroll that accountants can trust.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Automate BIR, SSS, PhilHealth, and Pag-IBIG for MSME client
            workspaces—without the Excel grind.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {highlights.map(({ Icon, label, detail }) => (
              <li
                key={label}
                className="mochi-shadow flex gap-4 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary"
                  aria-hidden
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-muted-foreground">
          Beta partners · lifetime 50% off workspace slots
        </p>
      </aside>

      {/* Form column */}
      <div className="relative flex h-screen flex-col">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
          aria-hidden
        >
          <div className="absolute -top-20 -left-10 size-72 rounded-full bg-primary-container/60 blur-3xl" />
          <div className="absolute top-1/4 -right-16 size-80 rounded-full bg-tertiary-container/50 blur-3xl" />
        </div>

        <header className="relative z-10 flex items-center px-4 pt-8 md:px-8 lg:px-10 lg:pt-10">
          <Link
            href="/"
            className="font-display inline-flex items-center gap-2 text-xl font-bold tracking-tight text-primary lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/12 text-primary">
              <HiOutlineShieldCheck className="size-5" aria-hidden />
            </span>
            Dalia
          </Link>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 md:px-8 lg:px-10 lg:py-12">
          <div className="mochi-shadow w-full max-w-md rounded-2xl border-2 border-border/60 bg-card p-7 sm:p-9 lg:max-w-lg lg:p-10">
            <h1 className="font-display text-2xl font-bold text-primary sm:text-[1.75rem]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
