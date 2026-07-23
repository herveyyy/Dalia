# Apps Launcher & Authentication Routing Design Spec

This document details the design and routing architecture for the authenticated apps launcher (`/apps`) page, the `/hris` route placeholder, and the update to the Founding Partner copywriting on the landing page.

## Requirements

1. **Founding Partner Pitch Update:**
   * Update the landing page close section to target both independent accounting firms and in-house company accounting teams.
   * Frame the offer as a lifetime 50% discount on the first 10 workspace slots.
   * Update button copy to "Become a Founding Partner".

2. **Apps launcher (`/apps`):**
   * Accessible only to authenticated users (redirect to `/login` if unauthenticated).
   * Show available apps in a premium card grid:
     * **Dalia HRIS:** Active, links to `/hris`.
     * **Finance & Sales:** "Coming Soon", glassmorphic card style, "Request Early Access" button.
     * **Operations CRM:** "Coming Soon", glassmorphic card style, "Request Early Access" button.

3. **Navigation Header:**
   * Display Company Name (or User Name) on the left.
   * Display User Name/Email and a working "Log out" button on the right.
   * Logging out terminates the session and redirects to `/login`.

4. **Home Page (`/`) Routing:**
   * If a user is logged in, redirect them to `/apps` automatically on the server side.

5. **Redirect on Sign in/Sign up:**
   * Successful logins/signups should redirect to `/apps` instead of `/`.

6. **`/hris` Dashboard Placeholder:**
   * Create a clean starter page to prevent 404s when launching HRIS.

## Proposed Components & Routing

### 1. `apps/web/app/apps/page.tsx` [NEW]
Server Component that performs authentication checks and renders the apps grid.
* Consumes: `auth.api.getSession`
* Interfaces: Redirects to `/login` if no session.

### 2. `apps/web/components/apps-header.tsx` [NEW]
Client Component representing the authenticated user header.
* Consumes: `companyName` and `userName`
* Interfaces: Call `signOut` from `@repo/auth/client` and redirect to `/login` on logout click.

### 3. `apps/web/app/hris/page.tsx` [NEW]
Server Component acting as a placeholder dashboard for Dalia HRIS.
* Consumes: `auth.api.getSession`
* Interfaces: Redirects to `/login` if no session.

### 4. `apps/web/app/page.tsx` [MODIFY]
Inject server-side redirect checks at the top of the component.
* Consumes: `auth.api.getSession`
* Interfaces: Redirects to `/apps` if a session is present.

### 5. `apps/web/lib/auth-actions.ts` [MODIFY]
Update redirection targets.
* Redirect to `/apps` instead of `/` upon successful signIn/signUp.

## Verification & Testing Plan

### Automated Checks
* Run lint checks to ensure all TypeScript and ESLint warnings are clean:
  ```bash
  bun run lint
  ```

### Manual Checks
1. Visit `/apps` when logged out -> should redirect to `/login`.
2. Register a new user -> should redirect directly to `/apps`.
3. Verify that the company/user name is displayed correctly in the header.
4. Click "Log out" -> should destroy session and redirect to `/login`.
5. Visit `/` while logged in -> should redirect instantly to `/apps`.
6. Click "Launch" on Dalia HRIS -> should navigate to `/hris`.
