# Page Transition Loading Edge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a top page transition loading indicator (`nextjs-toploader`) across Dalia web applications (`apps/web`, `apps/hris`, `apps/docs`).

**Architecture:** Create a reusable `<PageTransitionLoader />` component in `@repo/ui` configured with Dalia's theme color variable (`var(--primary)`). Integrate the component into the root layout of each application zone.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS, `nextjs-toploader`, Bun.

## Global Constraints

- Do not break existing layout structures or hydration.
- Configure loader to show only the thin edge line (no loading spinner).
- Use `var(--primary)` for color to ensure consistency across light/dark modes.

---

### Task 1: Add `nextjs-toploader` to `@repo/ui` and export `PageTransitionLoader`

**Files:**
- Modify: `packages/ui/package.json`
- Create: `packages/ui/src/components/atoms/PageTransitionLoader/index.ts`
- Create: `packages/ui/src/components/atoms/PageTransitionLoader/PageTransitionLoader.tsx`

**Interfaces:**
- Produces: `PageTransitionLoader` component exported from `@repo/ui/components/atoms/PageTransitionLoader`

- [ ] **Step 1: Install `nextjs-toploader` in `@repo/ui`**

Run in workspace root:
```bash
bun add nextjs-toploader --filter @repo/ui
```

- [ ] **Step 2: Add package export to `packages/ui/package.json`**

In `packages/ui/package.json`, add export definition under `exports`:
```json
"./components/atoms/PageTransitionLoader": "./src/components/atoms/PageTransitionLoader/index.ts"
```

- [ ] **Step 3: Create `PageTransitionLoader.tsx` component**

Create `packages/ui/src/components/atoms/PageTransitionLoader/PageTransitionLoader.tsx`:
```tsx
"use client";

import NextTopLoader from "nextjs-toploader";

export function PageTransitionLoader() {
  return (
    <NextTopLoader
      color="var(--primary)"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px var(--primary), 0 0 5px var(--primary)"
    />
  );
}
```

- [ ] **Step 4: Create `index.ts` barrel file**

Create `packages/ui/src/components/atoms/PageTransitionLoader/index.ts`:
```ts
export * from "./PageTransitionLoader.js";
```

- [ ] **Step 5: Verify types**

Run:
```bash
bun --filter @repo/ui check-types
```

- [ ] **Step 6: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add PageTransitionLoader component using nextjs-toploader"
```

---

### Task 2: Integrate `PageTransitionLoader` into `apps/web`

**Files:**
- Modify: `apps/web/app/layout.tsx`

**Interfaces:**
- Consumes: `PageTransitionLoader` from `@repo/ui/components/atoms/PageTransitionLoader`

- [ ] **Step 1: Update `apps/web/app/layout.tsx` to include `PageTransitionLoader`**

Import `PageTransitionLoader` and place it inside `<body>`:
```tsx
import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import { PageTransitionLoader } from "@repo/ui/components/atoms/PageTransitionLoader";
import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dalia HRIS — first product of the Dalia ERP",
    template: "%s · Dalia",
  },
  description:
    "Dalia is building an ERP for the Philippines accounting firms. We start with Dalia HRIS: timekeeping and statutory payroll for MSMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${quicksand.variable} font-sans antialiased`}
      >
        <PageTransitionLoader />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify type check**

Run:
```bash
bun --filter web check-types
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/layout.tsx
git commit -m "feat(web): integrate PageTransitionLoader into root layout"
```

---

### Task 3: Integrate `PageTransitionLoader` into `apps/hris` and `apps/docs`

**Files:**
- Modify: `apps/hris/app/layout.tsx`
- Modify: `apps/docs/app/layout.tsx` (if present)

**Interfaces:**
- Consumes: `PageTransitionLoader` from `@repo/ui/components/atoms/PageTransitionLoader`

- [ ] **Step 1: Check `apps/docs/app/layout.tsx`**

Check if layout exists in `apps/docs/app`.

- [ ] **Step 2: Update `apps/hris/app/layout.tsx` and `apps/docs/app/layout.tsx`**

Update `apps/hris/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import { PageTransitionLoader } from "@repo/ui/components/atoms/PageTransitionLoader";
import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dalia ERP",
  description: "Dalia ERP Multi-Zone app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${quicksand.variable} font-sans antialiased`}
      >
        <PageTransitionLoader />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify all workspace type checks**

Run:
```bash
bun run check-types
```

- [ ] **Step 4: Commit**

```bash
git add apps/hris apps/docs
git commit -m "feat(hris,docs): integrate PageTransitionLoader into root layouts"
```
