import {
  HiOutlineBuildingLibrary,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineHeart,
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

const runs = [
  { label: "BIR 1601-C", Icon: HiOutlineDocumentText },
  { label: "SSS 15% MSC", Icon: HiOutlineShieldCheck },
  { label: "PhilHealth 5%", Icon: HiOutlineHeart },
  { label: "Pag-IBIG", Icon: HiOutlineBuildingLibrary },
  { label: "Alphalist export", Icon: HiOutlineDocumentArrowUp },
] as const;

export function HeroStatutoryPanel() {
  return (
    <div
      className="animate-pop mochi-shadow-lg relative hidden w-full max-w-md rounded-2xl border-2 border-primary/15 bg-card p-8 lg:block"
      aria-hidden
    >
      <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
        2026 Statutory Run
      </p>
      <ul className="mt-8 flex flex-col gap-5">
        {runs.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Icon className="size-4" />
            </span>
            <span className="font-display shrink-0 text-base font-bold text-foreground">
              {label}
            </span>
            <span className="animate-draw-bar h-2 min-w-0 flex-1 rounded-full bg-primary-container" />
          </li>
        ))}
      </ul>
    </div>
  );
}
