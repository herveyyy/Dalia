"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowUpRight,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { authClient } from "@repo/auth/client";

interface UserShellProps {
  user?: {
    name: string;
    email: string;
    image?: string;
  } | null;
  children: React.ReactNode;
}

export function UserShell({ user, children }: UserShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { href: "/user", label: "Dashboard", icon: HiOutlineHome, authRequired: true },
    { href: "/user/jobs", label: "Available Jobs", icon: HiOutlineBriefcase, authRequired: false },
    { href: "/user/applications", label: "My Applications", icon: HiOutlineClipboardDocumentList, authRequired: true },
    { href: "/user/profile", label: "Profile & Employment", icon: HiOutlineUser, authRequired: true },
  ];

  const filteredNavItems = navItems.filter((item) => !item.authRequired || Boolean(user));

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/user/login";
  };

  return (
    <div className="flex min-h-screen flex-col dark:bg-slate-950">
      {/* Accessible & Umami-styled Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Brand Logo & Desktop Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <a
              href="/user"
              className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              aria-label="Dalia User Portal Home"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-sm">
                D
              </span>
              <span className="whitespace-nowrap font-extrabold text-foreground">
                Dalia <span className="text-primary font-medium">User Portal</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                      isActive
                        ? "bg-primary/12 text-primary font-bold shadow-xs border border-primary/20"
                        : "text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl border border-border/70 hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Main Site</span>
              <HiOutlineArrowUpRight className="size-3.5 shrink-0" />
            </a>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-border/80">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold leading-none text-foreground truncate max-w-[180px]">
                    {user.name}
                  </span>
                  <span className="text-[11px] leading-tight text-muted-foreground truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-1.5 text-xs h-8 px-3 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive shrink-0 font-semibold"
                  title="Sign out of account"
                  aria-label="Sign out"
                >
                  <HiOutlineArrowRightOnRectangle className="size-4 shrink-0" />
                  <span>Exit</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/user/login"
                  className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-3.5 py-1.5 text-xs font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Log in
                </a>
                <a
                  href="/user/jobs"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Browse Jobs
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <HiOutlineXMark className="size-6" /> : <HiOutlineBars3 className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileOpen ? (
          <div className="lg:hidden border-b border-border/80 bg-background px-4 pt-3 pb-5 space-y-2.5 animate-in slide-in-from-top-2">
            <nav className="space-y-1.5" aria-label="Mobile Navigation">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/12 text-primary font-bold border border-primary/20"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">{user.name}</span>
                    <span className="text-[11px] text-muted-foreground">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-1.5 text-xs text-destructive rounded-xl border-destructive/30"
                  >
                    <HiOutlineArrowRightOnRectangle className="size-4" />
                    <span>Sign out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full pt-1">
                  <a
                    href="/user/login"
                    className="flex-1 text-center rounded-xl border border-input py-2 text-xs font-semibold"
                  >
                    Log in
                  </a>
                  <a
                    href="/user/jobs"
                    className="flex-1 text-center rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground"
                  >
                    Browse Jobs
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Accessible Footer */}
      <footer className="border-t border-border/60 bg-background/50 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Dalia Candidate & Employee Portal. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <a href="/user/jobs" className="hover:text-foreground hover:underline transition-colors">Open Positions</a>
            <a href="/user/profile" className="hover:text-foreground hover:underline transition-colors">My Profile</a>
            <a href="/" className="hover:text-foreground hover:underline transition-colors">Main App</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
