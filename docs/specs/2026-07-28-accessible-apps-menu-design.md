# Accessible Apps Menu UI Design

## Overview
Redesign the Dalia ERP Applications launcher (`apps/web/app/apps`) from a sparse card layout into an accessible, interactive, menu-style application launcher grid.

## User Intent & Requirements
- **Menu Feel**: Replace sparse cards with a compact, cohesive menu launcher grid where each active application card acts as a unified interactive surface.
- **Accessibility**: Enforce WCAG 2.1 AA compliance including high contrast text, semantic navigation markup (`<nav>`, `<ul>`, `<li>`), keyboard focus indicators (`focus-visible`), aria labels, and screen reader announcements.

## Component & Layout Architecture

### 1. `AppsHeader` & `AppsPage` Layout (`apps/web/app/apps/page.tsx`)
- Container uses semantic `<nav aria-label="ERP Applications Menu">`.
- Header section uses responsive, clear typography with high text contrast.

### 2. `AppsGrid` Component (`apps/web/app/apps/utils/components/apps-grid.tsx`)
- **Semantic Structure**: Render an unordered list `<ul role="list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">`.
- **Card Interactive Surface**:
  - Entire card surface is wrapped in `<a href="...">` for active apps, enabling full surface clickable area.
  - Keyboard Focus: Uses `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none`.
  - Screen Reader: `aria-label` includes full context: `"{appName}: {appDescription}"`.
- **States**:
  - **Active**: Elevated card with subtle border hover effect, icon tint, and action indicator arrow animation.
  - **Restricted**: Rendered with lock icon, clear warning badge (`Restricted`), `aria-disabled="true"`, and clear helper text explaining permission restriction.
  - **Coming Soon**: Rendered with secondary badge (`Coming Soon`), `aria-disabled="true"`, and muted preview styling.

## Verification Plan
1. Test keyboard navigation using `Tab` and `Enter` keys.
2. Confirm focus ring visibility across active menu cards.
3. Validate visual contrast ratios for text and badges.
