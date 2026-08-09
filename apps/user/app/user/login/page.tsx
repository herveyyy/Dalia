import Link from "next/link";
import { userSignInAction } from "../utils/actions";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";

export default async function LoginPage(props: {
  searchParams?: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = (await props.searchParams) || {};
  const error = params.error;
  const redirectUrl = params.redirect || "/user";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-xl shadow-inner">
            D
          </span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Sign In to Candidate Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Access your profile, job applications, and employment details
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive flex items-center gap-2.5">
            <HiOutlineExclamationTriangle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <form action={userSignInAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectUrl} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Work / Candidate Email</Label>
            <div className="relative">
              <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="candidate@example.com"
                required
                className="pl-11 h-10 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="pl-11 h-10 text-xs"
              />
            </div>
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full font-bold gap-2 text-xs mt-2">
            <span>Sign In</span>
            <HiOutlineArrowRight className="size-4" />
          </Button>
        </form>

        <div className="pt-4 border-t border-border text-center space-y-3 text-xs text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <a href="/user/jobs" className="font-bold text-primary hover:underline">
              Browse Open Jobs to Register
            </a>
          </p>
          <div className="pt-1">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
            >
              ← Back to Main App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
