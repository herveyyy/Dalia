import Link from "next/link";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineFlag,
  HiOutlineHeart,
  HiOutlineMap,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from "react-icons/hi2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/molecules/Card";
import { buttonVariants } from "@repo/ui/components/atoms/Button";
import { cn } from "@repo/ui/lib/utils";
import {
  HeroBackdrop,
  HeroStatutoryPanel,
} from "../components/hero-visual";
import { SiteHeader } from "../components/site-header";

const story = [
  {
    step: "01",
    t: "Who we are",
    d: "Dalia is building ERP software for Philippine accounting firms and teams—the people who already run MSME payrolls, filings, and books every month.",
    Icon: HiOutlineMap,
  },
  {
    step: "02",
    t: "Our goal",
    d: "Become their system of record: one trusted stack for people, pay, statutory, then finance and ops—so teams stop stitching Excel, portals, and desktop tools.",
    Icon: HiOutlineFlag,
  },
  {
    step: "03",
    t: "First step · Dalia HRIS",
    d: "Ship HRIS, timekeeping, and statutory payroll first—BIR 1601-C, SSS, PhilHealth, Pag-IBIG, Alphalist. Nail compliance, earn trust, then expand the ERP.",
    Icon: HiOutlineShieldCheck,
  },
] as const;

const nextSteps = [
  {
    t: "Prove HRIS",
    d: "Flawless attendance → statutory math → portal-ready exports. No churn on compliance.",
  },
  {
    t: "Widen the team",
    d: "Multi-workspace pricing that fits retainers while employee profiles grow.",
  },
  {
    t: "Grow into ERP",
    d: "Add finance, ops, and the rest once firms already live inside Dalia every payroll cycle.",
  },
] as const;

const tiers = [
  {
    name: "Micro",
    range: "1–10 employees",
    price: "350",
    target:
      "Small coffee shops, retail kiosks, & family-owned logistics.",
    value:
      "Easily absorbed by the accountant’s standard ₱5,000 monthly retainer.",
    featured: false,
    Icon: HiOutlineUsers,
  },
  {
    name: "SME",
    range: "11–50 employees",
    price: "1,200",
    target:
      "Fast-food franchises, mid-sized construction sub-contractors, and regional distributors.",
    value:
      "Saves the accountant roughly 6 to 8 hours of manual Excel compilation per payroll cycle.",
    featured: true,
    Icon: HiOutlineRocketLaunch,
  },
  {
    name: "Enterprise",
    range: "51–150 employees",
    price: "3,500",
    target: "Multi-branch retail chains and large local manufacturing plants.",
    value:
      "Handles complex, multi-shift attendance logs and high-volume data arrays that crash desktop software.",
    featured: false,
    Icon: HiOutlineBuildingOffice2,
  },
] as const;

const complianceRows = [
  {
    k: "SSS",
    v: "15% of Monthly Salary Credit (Employer 10%, Employee 5%).",
    Icon: HiOutlineShieldCheck,
  },
  {
    k: "PhilHealth",
    v: "5% of basic salary (2.5% each). Floor ₱500 / cap ₱5,000.",
    Icon: HiOutlineHeart,
  },
  {
    k: "BIR",
    v: "1601-C encoding and Alphalist export ready for portal upload.",
    Icon: HiOutlineDocumentText,
  },
] as const;

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/apps");
  }

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <section className="relative min-h-dvh overflow-hidden">
        <HeroBackdrop />
        <div className="relative z-10 mx-auto grid min-h-dvh max-w-360 items-center gap-10 px-4 pt-28 pb-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="max-w-xl">
            <p className="animate-rise font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Dalia
            </p>
            <h1 className="animate-rise-delay font-display mt-5 text-2xl leading-9 font-bold text-balance text-foreground md:text-4xl md:leading-[1.2]">
              An ERP for accounting firms and teams—starting with HRIS.
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-6 text-muted-foreground md:text-lg md:leading-7">
              We are building the full Dalia ERP. Step one is Dalia HRIS:
              timekeeping and Philippine statutory payroll firms and teams can trust.
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "font-display gap-2",
                )}
              >
                Start with Dalia HRIS
                <HiOutlineArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href="#plan"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "font-display gap-2",
                )}
              >
                See the plan
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroStatutoryPanel />
          </div>
        </div>
      </section>

      <section id="plan" className="scroll-mt-16 bg-card/60">
        <div className="mx-auto max-w-360 px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
              The plan
            </p>
            <h2 className="font-display mt-3 text-2xl leading-8 font-bold text-primary md:text-3xl md:leading-10">
              What we are, where we’re going, what we ship first.
            </h2>
          </div>

          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {story.map(({ step, t, d, Icon }) => (
              <li
                key={step}
                className="mochi-shadow flex flex-col rounded-2xl border border-border/70 bg-card p-6 md:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-xs font-bold tracking-[0.5px] text-muted-foreground uppercase">
                    {step}
                  </span>
                  <span
                    className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary"
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
                <h3 className="font-display mt-6 text-lg font-bold text-foreground">
                  {t}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                  {d}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-t border-border/50 pt-12">
            <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
              After the first step
            </p>
            <ul className="mt-6 grid gap-6 md:grid-cols-3">
              {nextSteps.map(({ t, d }) => (
                <li key={t}>
                  <p className="font-display text-base font-bold text-foreground">
                    {t}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {d}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-16 bg-background">
        <div className="mx-auto max-w-360 px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-xl">
            <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
              Step one pricing &middot; For accounting firms and teams
            </p>
            <h2 className="font-display mt-3 text-2xl leading-8 font-bold text-primary">
              Fixed costs firms can roll into retainers.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Price by employee profiles per workspace—not per-seat surprise—so
              fees track the payroll work accountants already do.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "mochi-shadow flex flex-col gap-0 rounded-2xl border-2 border-border/60 bg-card py-8 ring-0 [--card-spacing:--spacing(8)]",
                  tier.featured && "mochi-shadow-lg border-primary/30",
                )}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full",
                          tier.featured
                            ? "bg-secondary/15 text-secondary"
                            : "bg-primary/12 text-primary",
                        )}
                        aria-hidden
                      >
                        <tier.Icon className="size-5" />
                      </span>
                      <CardTitle className="font-display text-lg font-bold">
                        {tier.name}
                      </CardTitle>
                    </div>
                    {tier.featured ? (
                      <span className="rounded-full bg-secondary/15 px-3 py-1.5 font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
                        Sweet spot
                      </span>
                    ) : null}
                  </div>
                  <CardDescription className="font-display font-medium">
                    {tier.range}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-8 pt-6">
                  <p className="tabular font-display text-4xl font-bold tracking-tight text-foreground">
                    <span className="text-xl font-bold">₱</span>
                    {tier.price}
                    <span className="ml-1 text-base font-medium text-muted-foreground">
                      / mo
                    </span>
                  </p>
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
                        Target
                      </p>
                      <p className="mt-2.5 text-sm leading-6 text-foreground">
                        {tier.target}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
                        Value
                      </p>
                      <p className="mt-2.5 text-sm leading-6 text-foreground">
                        {tier.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-8 border-t-0 bg-transparent pt-0 pb-8">
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({
                        variant: tier.featured ? "default" : "outline",
                      }),
                      "font-display w-full",
                    )}
                  >
                    Choose {tier.name}
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/5">
        <div className="mx-auto grid max-w-360 items-start gap-12 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-8 md:py-24">
          <div>
            <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
              Why HRIS first
            </p>
            <h2 className="font-display mt-3 text-2xl leading-8 font-bold text-primary md:text-3xl md:leading-10">
              Their most painful monthly bottleneck.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Statutory filing is where trust is won or lost. Fix attendance →
              brackets → portal exports, and the team will already be inside
              Dalia when the wider ERP modules arrive.
            </p>
            <blockquote className="mochi-shadow mt-10 max-w-xl rounded-2xl border-2 border-primary/15 bg-card p-6 text-base leading-7 text-foreground md:p-8">
              <p>
                “You upload the raw attendance logs, and the system
                automatically cross-references the 2026 statutory brackets and
                exports the exact structures required for government portals.”
              </p>
              <p className="font-display mt-4 font-bold text-primary">
                What takes your team three days now takes five minutes.
              </p>
            </blockquote>
          </div>

          <div className="mochi-shadow overflow-hidden rounded-2xl border-2 border-border/60 bg-card">
            <div className="border-b border-border/50 px-6 py-5 md:px-8 md:py-6">
              <div className="flex items-center gap-2">
                <HiOutlineClock className="size-4 text-primary" aria-hidden />
                <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
                  Inside Dalia HRIS · 2026 math
                </p>
              </div>
            </div>

            <ul className="divide-y divide-border/40 px-2 py-2 md:px-3">
              {complianceRows.map(({ k, v, Icon }) => (
                <li
                  key={k}
                  className="flex gap-4 px-4 py-5 md:px-5 md:py-6"
                >
                  <span
                    className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary"
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold text-foreground">
                      {k}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {v}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/50 bg-primary/5 px-6 py-6 md:px-8 md:py-8">
              <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
                Founding partners &middot; lifetime 50% off workspace slots
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Because your firm or team handles complex payroll structures, I want to bring you on as a Founding Partner. You will get 50% off your first 10 workspace slots for the lifetime of those accounts. In return, I just need your team to flag any edge cases they hit during the 2026 statutory updates.
              </p>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "font-display mt-6 inline-flex w-full gap-2 sm:w-auto",
                )}
              >
                Become a Founding Partner
                <HiOutlineArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card">
        <div className="mx-auto flex max-w-360 flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-display text-sm font-bold text-primary">Dalia</p>
          <p className="text-sm text-muted-foreground">
            Building the ERP · shipping Dalia HRIS first
          </p>
          <div className="font-display flex gap-4 text-sm font-bold text-muted-foreground">
            <Link href="/login" className="hover:text-primary">
              Log in
            </Link>
            <Link href="/register" className="hover:text-primary">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
