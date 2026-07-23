# Apps Launcher & Authentication Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a secure apps launcher page (`/apps`) with a navigation header, log out capabilities, and seamless authentication redirection.

**Architecture:** Implement server-side session checks in the page routes to control access and redirects. Provide a client component for the header to trigger Better Auth sign-out and redirect back to login.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Better Auth, React Icons.

## Global Constraints

- Authentication check must use `auth.api.getSession` on the server side.
- All redirect logic must utilize `next/navigation`'s `redirect` function.
- Log out must utilize `signOut` from `@repo/auth/client` on the client side.
- Design must follow the premium aesthetic (glassmorphism, gradients, HSL colors, micro-animations).

---

### Task 1: Redirection Integration & Route Logic

**Files:**
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/lib/auth-actions.ts`

**Interfaces:**
- Consumes: `auth.api.getSession`
- Produces: Server-side redirection on `/` and successful sign-in/sign-up redirection to `/apps`.

- [ ] **Step 1: Update apps/web/app/page.tsx to redirect authenticated users**
  Modify [apps/web/app/page.tsx](file:///c:/Users/hmapa/Documents/PROJECTS/dalia/apps/web/app/page.tsx) to check for a session and redirect if found.
  ```typescript
  import { auth } from "@repo/auth";
  import { headers } from "next/headers";
  import { redirect } from "next/navigation";

  // Change Home() signature to async:
  export default async function Home() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      redirect("/apps");
    }
    
    // ... rest of the landing page code remains identical
  ```

- [ ] **Step 2: Update apps/web/lib/auth-actions.ts redirect targets**
  Modify [apps/web/lib/auth-actions.ts](file:///c:/Users/hmapa/Documents/PROJECTS/dalia/apps/web/lib/auth-actions.ts) to redirect to `/apps` instead of `/` on success.
  ```typescript
  // In signInAction and signUpAction, replace redirect("/") with redirect("/apps")
  ```

- [ ] **Step 3: Run local dev compiler to verify no syntax errors**
  Run: `bun run lint`
  Expected: Command executes with no syntax errors in these files (placeholder warnings in `apps/page.tsx` can remain for now).

- [ ] **Step 4: Commit changes**
  ```bash
  git add apps/web/app/page.tsx apps/web/lib/auth-actions.ts
  git commit -m "feat: integrate auth redirect rules to /apps"
  ```

---

### Task 2: Navigation Header Component

**Files:**
- Create: `apps/web/components/apps-header.tsx`

**Interfaces:**
- Consumes: `companyName` (string) and `userName` (string)
- Produces: `AppsHeader` (React Component)

- [ ] **Step 1: Create the AppsHeader component**
  Create the file `apps/web/components/apps-header.tsx` containing:
  ```typescript
  "use client";

  import { signOut } from "@repo/auth/client";
  import { useRouter } from "next/navigation";
  import { Button } from "@repo/ui/components/button";
  import { HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

  export function AppsHeader({ companyName, userName }: { companyName?: string | null; userName: string }) {
    const router = useRouter();

    const handleLogout = async () => {
      await signOut();
      router.push("/login");
      router.refresh();
    };

    return (
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              Dalia
            </span>
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">
              {companyName || userName}
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
  ```

- [ ] **Step 2: Commit header component**
  ```bash
  git add apps/web/components/apps-header.tsx
  git commit -m "feat: add AppsHeader navigation component"
  ```

---

### Task 3: Apps Menu Page Implementation

**Files:**
- Modify: `apps/web/app/apps/page.tsx`

**Interfaces:**
- Consumes: `auth.api.getSession`, `AppsHeader`
- Produces: Authenticated `/apps` page layout.

- [ ] **Step 1: Rewrite apps/web/app/apps/page.tsx**
  Update the page with the complete layout, fetching the session and displaying the cards for Dalia HRIS, Finance & Sales, and Operations CRM.
  ```typescript
  import { auth } from "@repo/auth";
  import { headers } from "next/headers";
  import { redirect } from "next/navigation";
  import Link from "next/link";
  import {
    HiOutlineArrowRight,
    HiOutlineBuildingOffice2,
    HiOutlineRocketLaunch,
    HiOutlineShieldCheck,
  } from "react-icons/hi2";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@repo/ui/components/card";
  import { buttonVariants } from "@repo/ui/components/button";
  import { cn } from "@repo/ui/lib/utils";
  import { AppsHeader } from "../../components/apps-header";

  export default async function AppsPage() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/login");
    }

    const { user } = session;

    const apps = [
      {
        id: "hris",
        name: "Dalia HRIS",
        description: "Philippine statutory payroll, automated timekeeping, and employee files.",
        icon: HiOutlineShieldCheck,
        href: "/hris",
        status: "active",
        statusLabel: "Launch App",
      },
      {
        id: "finance",
        name: "Finance & Sales",
        description: "Invoicing, automated bookkeeping, and tax filings for MSMEs.",
        icon: HiOutlineBuildingOffice2,
        href: "#",
        status: "coming_soon",
        statusLabel: "Request Early Access",
      },
      {
        id: "crm",
        name: "Operations CRM",
        description: "Manage client retainers, task pipelines, and firm operations in one place.",
        icon: HiOutlineRocketLaunch,
        href: "#",
        status: "coming_soon",
        statusLabel: "Request Early Access",
      },
    ];

    return (
      <div className="min-h-screen bg-background">
        <AppsHeader companyName={user.companyName} userName={user.name} />
        
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Available Applications
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Select an application below to manage your firm's workflows or client workspaces.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => {
              const Icon = app.icon;
              const isActive = app.status === "active";

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
                          isActive ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="size-5" />
                      </span>
                      {!isActive && (
                        <span className="rounded-full bg-secondary/15 px-2.5 py-1 font-display text-[10px] font-bold tracking-[0.5px] text-secondary uppercase">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <CardTitle className="font-display text-lg font-bold mt-2">
                      {app.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground min-h-[48px]">
                      {app.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-0 mt-6 pt-0 border-t-0 bg-transparent">
                    {isActive ? (
                      <Link
                        href={app.href}
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full font-display gap-2"
                        )}
                      >
                        {app.statusLabel}
                        <HiOutlineArrowRight className="size-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full font-display border-dashed opacity-60 cursor-not-allowed"
                        )}
                      >
                        {app.statusLabel}
                      </button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit apps page changes**
  ```bash
  git add apps/web/app/apps/page.tsx
  git commit -m "feat: implement /apps menu dashboard"
  ```

---

### Task 4: Dalia HRIS Placeholder Route

**Files:**
- Create: `apps/web/app/hris/page.tsx`

**Interfaces:**
- Consumes: `auth.api.getSession`, `AppsHeader`
- Produces: `/hris` route landing placeholder.

- [ ] **Step 1: Create apps/web/app/hris/page.tsx**
  Create a basic authenticated placeholder dashboard for `/hris`:
  ```typescript
  import { auth } from "@repo/auth";
  import { headers } from "next/headers";
  import { redirect } from "next/navigation";
  import Link from "next/link";
  import { HiOutlineArrowLeft, HiOutlineShieldCheck } from "react-icons/hi2";
  import { AppsHeader } from "../../components/apps-header";

  export default async function HrisPage() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/login");
    }

    const { user } = session;

    return (
      <div className="min-h-screen bg-background">
        <AppsHeader companyName={user.companyName} userName={user.name} />
        
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <HiOutlineArrowLeft className="size-4" />
              Back to apps
            </Link>
            
            <div className="mt-8 flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
                <HiOutlineShieldCheck className="size-6" />
              </span>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Dalia HRIS Dashboard
              </h1>
            </div>
            
            <p className="mt-4 text-base text-muted-foreground max-w-xl">
              This is the workspace for managing your company or client's Philippine statutory payroll, automated timekeeping, and employee files.
            </p>

            <div className="mt-8 p-12 border-2 border-dashed border-border/60 rounded-2xl bg-card/30 text-center w-full max-w-2xl">
              <p className="font-display font-medium text-foreground text-lg">
                HRIS Workspace Core Modules
              </p>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Statutory formulas, clock log ingestion, and BIR portal exports are being prepared for your active tenant session.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit hris page**
  ```bash
  git add apps/web/app/hris/page.tsx
  git commit -m "feat: add /hris dashboard placeholder page"
  ```
