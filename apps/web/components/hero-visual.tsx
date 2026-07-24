import {
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

/** Soft mint plane + statutory “activity bubble”. */
export function HeroBackdrop() {
  return (
    <div
      className="animate-fade pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-24 -left-16 size-112 rounded-full bg-primary-container/50 blur-3xl" />
      <div className="absolute top-1/3 -right-20 size-104 rounded-full bg-tertiary-container/55 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 size-88 rounded-full bg-secondary-container/25 blur-3xl" />
      <div className="hero-dots absolute inset-0 opacity-[0.35]" />
    </div>
  );
}

const erpModules = [
  { label: "Firm Workspace Hub", sub: "Multi-client compliance control", Icon: HiOutlineHome, status: "Live" },
  { label: "HRIS & Statutory Payroll", sub: "2026 BIR 1601-C, SSS, PhilHealth", Icon: HiOutlineShieldCheck, status: "Live" },
  { label: "Finance & Invoicing", sub: "Client billing & BIR filings", Icon: HiOutlineBuildingOffice2, status: "Coming Soon" },
  { label: "Operations CRM", sub: "Client retainers & task pipelines", Icon: HiOutlineRocketLaunch, status: "Coming Soon" },
] as const;

export function HeroErpPanel() {
  return (
    <div
      className="animate-pop mochi-shadow-lg relative hidden w-full max-w-md rounded-2xl border-2 border-primary/15 bg-card p-8 lg:block"
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
          Dalia ERP Platform Stack
        </p>
        <span className="rounded-full bg-primary/12 px-2.5 py-0.5 font-display text-[10px] font-bold text-primary">
          Unified System
        </span>
      </div>
      <ul className="mt-6 flex flex-col gap-4">
        {erpModules.map(({ label, sub, Icon, status }) => (
          <li key={label} className="flex items-center gap-3.5 rounded-xl border border-border/50 bg-background/60 p-3.5 transition-colors">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-foreground leading-snug">
                {label}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {sub}
              </p>
            </div>
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${status === "Live" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
              {status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
