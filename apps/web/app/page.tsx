import Link from "next/link";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineHome,
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
import { HeroBackdrop, HeroErpPanel } from "../components/hero-visual";
import { SiteHeader } from "../components/site-header";
import { ScrollReveal } from "../components/scroll-reveal";

const erpModulesList = [
  {
    id: "firm-hub",
    title: "Firm & Multi-Workspace Hub",
    badge: "Core OS",
    description:
      "Manage all client workspaces, firm user permissions, partner access, and company roles from one centralized control center.",
    features: [
      "Multi-tenant client workspace switching",
      "Firm partner & staff RBAC permission controls",
      "Centralized client directory & admin management",
      "Company compliance & audit trails",
    ],
    Icon: HiOutlineHome,
  },
  {
    id: "hris-payroll",
    title: "HRIS & Statutory Payroll",
    badge: "Live Module",
    description:
      "Full the Philippines HRIS with automated timekeeping, biometric log processing, and 2026 statutory compliance built right in.",
    features: [
      "SSS 15% Monthly Salary Credit math",
      "PhilHealth 5% contribution calculation",
      "BIR 1601-C & 2316 Alphalist portal export ready",
      "Automated attendance, leaves, & shift logs",
    ],
    Icon: HiOutlineShieldCheck,
  },
  {
    id: "finance-billing",
    title: "Finance & Invoicing Engine",
    badge: "Coming Soon",
    description:
      "Automated client invoicing, recurring retainer billing, bookkeeping, and the Philippines tax filings tailored for MSMEs.",
    features: [
      "Automated retainer billing & client invoicing",
      "Real-time ledger & automated bookkeeping",
      "BIR tax filing preparation & reports",
      "Multi-entity cash flow monitoring",
    ],
    Icon: HiOutlineBuildingOffice2,
  },
  {
    id: "operations-crm",
    title: "Operations & Task CRM",
    badge: "Coming Soon",
    description:
      "Streamline firm client retainers, job pipelines, task assignments, and document sharing in one unified workspace.",
    features: [
      "Client retainer pipeline & status tracking",
      "Task assignment & deadline management",
      "Secure client document vault & sharing",
      "Firm productivity analytics & reporting",
    ],
    Icon: HiOutlineRocketLaunch,
  },
] as const;

const tiers = [
  {
    name: "Micro",
    range: "Best for 1–10 employees",
    price: "350",
    badge: "1 Free Workspace",
    isContact: false,
    target: "Small coffee shops, retail kiosks, & family-owned logistics.",
    value:
      "Easily absorbed by the accountant’s standard ₱5,000 monthly retainer. First workspace is 100% free.",
    featured: false,
    Icon: HiOutlineUsers,
  },
  {
    name: "SME",
    range: "Best for 11–50 employees",
    price: "1,200",
    badge: "Sweet spot",
    isContact: false,
    target:
      "Fast-food franchises, mid-sized construction sub-contractors, and regional distributors.",
    value:
      "Saves the accountant roughly 6 to 8 hours of manual Excel compilation per payroll cycle.",
    featured: true,
    Icon: HiOutlineRocketLaunch,
  },
  {
    name: "Enterprise",
    range: "Best for 51–150 employees",
    price: "3,500",
    badge: null,
    isContact: false,
    target: "Multi-branch retail chains and large local manufacturing plants.",
    value:
      "Handles complex, multi-shift attendance logs and high-volume data arrays that crash desktop software.",
    featured: false,
    Icon: HiOutlineBuildingOffice2,
  },
  {
    name: "Custom",
    range: "White-label & Enterprise",
    price: "Contact Us",
    badge: "Custom Setup",
    isContact: true,
    target:
      "Firms needing custom domain URL, branded logo, custom landing page, consolidated database, & custom workflows.",
    value:
      "Tailored infrastructure, dedicated database instances, custom feature builds, and full white-label branding.",
    featured: false,
    Icon: HiOutlineShieldCheck,
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

      {/* Hero Section */}
      <section className="relative min-h-dvh overflow-hidden">
        <HeroBackdrop />
        <div className="relative z-10 mx-auto grid min-h-dvh max-w-360 items-center gap-10 px-4 pt-28 pb-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="max-w-xl">
            <p className="animate-rise font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Dalia ERP
            </p>
            <h1 className="animate-rise-delay font-display mt-5 text-2xl leading-9 font-bold text-balance text-foreground md:text-4xl md:leading-[1.2]">
              The Complete ERP Operating System for Accounting Firms and Teams.
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-lg text-base leading-6 text-muted-foreground md:text-lg md:leading-7">
              Unify client workspaces, the Philippines statutory payroll, billing, and firm operations into one seamless cloud platform.
            </p>
            <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "font-display gap-2"
                )}
              >
                Start Dalia ERP Workspace
                <HiOutlineArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href="#modules"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "font-display gap-2"
                )}
              >
                Explore ERP Platform
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroErpPanel />
          </div>
        </div>
      </section>

      {/* ERP Modules Section */}
      <section id="modules" className="scroll-mt-16 bg-card/60 py-20 md:py-28">
        <div className="mx-auto max-w-360 px-4 md:px-8">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
                The Dalia ERP Ecosystem
              </p>
              <h2 className="font-display mt-3 text-2xl leading-8 font-bold text-primary md:text-3xl md:leading-10">
                Built specifically for accounting firms & the Philippines businesses.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Stop stitching together spreadsheets, desktop tools, and portal encoders. Dalia ERP brings people, pay, billing, and ops together.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {erpModulesList.map((mod, index) => {
              const Icon = mod.Icon;
              return (
                <ScrollReveal key={mod.id} delayMs={index * 120}>
                  <Card className="mochi-shadow h-full flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 md:p-8 transition-all hover:border-primary/40 hover:shadow-md">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                          <Icon className="size-6" />
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 font-display text-xs font-bold tracking-[0.5px] uppercase",
                            mod.badge === "Live Module" || mod.badge === "Core OS"
                              ? "bg-emerald-500/12 text-emerald-600"
                              : "bg-secondary/15 text-secondary"
                          )}
                        >
                          {mod.badge}
                        </span>
                      </div>

                      <h3 className="font-display mt-6 text-xl font-bold text-foreground">
                        {mod.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                        {mod.description}
                      </p>

                      <ul className="mt-6 space-y-2.5">
                        {mod.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground/90">
                            <HiOutlineCheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 border-t border-border/50 pt-4">
                      <Link
                        href="/register"
                        className="font-display inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                      >
                        Launch in Workspace
                        <HiOutlineArrowRight className="size-4" />
                      </Link>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-16 bg-background py-20 md:py-28">
        <div className="mx-auto max-w-360 px-4 md:px-8">
          <ScrollReveal>
            <div className="max-w-xl">
              <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
                ERP Pricing &middot; Per Workspace
              </p>
              <h2 className="font-display mt-3 text-2xl leading-8 font-bold text-primary">
                Flat rates per workspace. 1 free Micro workspace.
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Flat monthly rates per workspace—designed to fit neatly into client retainers.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, index) => (
              <ScrollReveal key={tier.name} delayMs={index * 150}>
                <Card
                  className={cn(
                    "mochi-shadow flex flex-col gap-0 rounded-2xl border-2 border-border/60 bg-card py-8 ring-0 [--card-spacing:--spacing(8)] h-full",
                    tier.featured && "mochi-shadow-lg border-primary/30"
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
                              : "bg-primary/12 text-primary"
                          )}
                          aria-hidden
                        >
                          <tier.Icon className="size-5" />
                        </span>
                        <CardTitle className="font-display text-lg font-bold">
                          {tier.name}
                        </CardTitle>
                      </div>
                      {tier.badge ? (
                        <span
                          className={cn(
                            "rounded-full px-3 py-1.5 font-display text-xs font-bold tracking-[0.5px] uppercase",
                            tier.name === "Micro"
                              ? "bg-primary/15 text-primary"
                              : tier.name === "Custom"
                              ? "bg-primary/15 text-primary"
                              : "bg-secondary/15 text-secondary"
                          )}
                        >
                          {tier.badge}
                        </span>
                      ) : null}
                    </div>
                    <CardDescription className="font-display font-medium">
                      {tier.range}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-8 pt-6">
                    <p className="tabular font-display text-3xl font-bold tracking-tight text-foreground">
                      {tier.isContact ? (
                        <span>Contact Us</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold">₱</span>
                          {tier.price}
                          <span className="ml-1 text-sm font-medium text-muted-foreground">
                            / mo per workspace
                          </span>
                        </>
                      )}
                    </p>
                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="font-display text-xs font-bold tracking-[0.5px] text-primary uppercase">
                          Best For
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
                      href={tier.isContact ? "#founding-partners" : "/register"}
                      className={cn(
                        buttonVariants({
                          variant: tier.featured || tier.isContact ? "default" : "outline",
                        }),
                        "font-display w-full"
                      )}
                    >
                      {tier.isContact ? "Contact Us" : `Choose ${tier.name}`}
                    </Link>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Partner Program Section */}
      <section id="founding-partners" className="scroll-mt-16 bg-primary/5 py-20 md:py-28">
        <div className="mx-auto max-w-360 px-4 md:px-8">
          <ScrollReveal>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <p className="font-display text-xs font-bold tracking-[0.5px] text-secondary uppercase">
                  Founding Partners Program
                </p>
                <h2 className="font-display mt-3 text-2xl leading-8 font-bold text-primary md:text-3xl md:leading-10">
                  Build the future of the Philippines ERP together.
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  We are working closely with accounting firms and internal accounting teams to shape Dalia ERP into the most efficient system of record for businesses in the the Philippiness.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <HiOutlineCheckCircle className="mt-1 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-display font-bold text-foreground">Lifetime 50% Off Workspaces</p>
                      <p className="text-sm text-muted-foreground">Get 50% off your first 10 workspace slots for the lifetime of those accounts.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HiOutlineCheckCircle className="mt-1 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-display font-bold text-foreground">Direct Product Input & Support</p>
                      <p className="text-sm text-muted-foreground">Direct communication channel with engineering for custom statutory edge cases & features.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mochi-shadow rounded-2xl border-2 border-primary/15 bg-card p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <HiOutlineDocumentText className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">Become a Founding Partner</p>
                    <p className="text-xs text-muted-foreground">Limited founding slots for accounting firms</p>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">
                  Join early partner accounting firms who are digitizing client payroll, statutory compliance, and financial workflows on Dalia ERP.
                </p>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "font-display mt-8 w-full justify-center gap-2"
                  )}
                >
                  Claim Founding Partner Access
                  <HiOutlineArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card">
        <div className="mx-auto flex max-w-360 flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-display text-sm font-bold text-primary">Dalia ERP</p>
          <p className="text-sm text-muted-foreground">
            The Complete Operating System for Accounting Firms and Teams
          </p>
          <div className="font-display flex gap-4 text-sm font-bold text-muted-foreground">
            <Link href="/login" className="hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register" className="hover:text-primary transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
