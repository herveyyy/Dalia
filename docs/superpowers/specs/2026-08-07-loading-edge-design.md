# Loading Edge / Page Transition Indicator Design

## Overview
This design specifies the implementation of a top page-loading progress indicator (loading edge) when switching pages or links across the Dalia monorepo applications (`apps/web`, `apps/hris`, `apps/docs`).

## Requirements
- Provide a visible visual cue at the top edge of the browser viewport during page navigation.
- Consistent color scheme matching Dalia's theme (`var(--primary)`).
- Clean, non-intrusive appearance (progress bar with subtle shadow glow, no spinner).
- Automatically trigger on client-side routing and programmatic navigation.

## Design Details

### 1. Centralized Component in `@repo/ui`
Add `nextjs-toploader` to `packages/ui` and expose a reusable `PageTransitionLoader` component.

File: `packages/ui/src/components/atoms/PageTransitionLoader/index.tsx`
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

Exports in `packages/ui/package.json`:
Add `"./components/atoms/PageTransitionLoader"` export path.

### 2. Integration in Applications
Import and place `<PageTransitionLoader />` in the root layouts:
- `apps/web/app/layout.tsx`
- `apps/hris/app/layout.tsx`
- `apps/docs/app/layout.tsx` (if layout exists)

## Verification Strategy
- Run `bun run check-types` across the workspace to ensure TypeScript compliance.
- Test navigation across routes in `apps/web` and `apps/hris`.
