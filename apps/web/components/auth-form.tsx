import Link from "next/link";
import type { ReactNode } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi2";
import { Button } from "@repo/ui/components/atoms/Button";
import { Input } from "@repo/ui/components/atoms/Input";
import { Label } from "@repo/ui/components/atoms/Label";
import { signInAction, signUpAction } from "../lib/auth-actions";

type Mode = "login" | "register";

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

export function AuthForm({
  mode,
  error,
}: {
  mode: Mode;
  error?: string;
}) {
  const isRegister = mode === "register";
  const inputIconClass = "pl-11";

  return (
    <form
      action={isRegister ? signUpAction : signInAction}
      className="mt-7 flex flex-col gap-4"
    >
      {isRegister ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="name"
            label="Full name"
            icon={<HiOutlineUser className="size-4" />}
          >
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Jordan Reyes"
              required
              className={inputIconClass}
            />
          </Field>

          <Field
            id="companyName"
            label="Company name"
            icon={<HiOutlineBuildingOffice2 className="size-4" />}
          >
            <Input
              id="companyName"
              name="companyName"
              autoComplete="organization"
              placeholder="Reyes Accounting Firm"
              required
              className={inputIconClass}
            />
          </Field>
        </div>
      ) : null}

      <Field
        id="email"
        label="Work email"
        icon={<HiOutlineEnvelope className="size-4" />}
      >
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@firm.ph"
          required
          className={inputIconClass}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        icon={<HiOutlineLockClosed className="size-4" />}
      >
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          placeholder={isRegister ? "At least 8 characters" : "••••••••"}
          minLength={8}
          required
          className={inputIconClass}
        />
      </Field>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl border-2 border-destructive/25 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="font-display mt-2 w-full gap-2"
      >
        {isRegister ? "Create workspace" : "Sign in"}
        <HiOutlineArrowRight className="size-4" aria-hidden />
      </Button>

      <p className="pt-1 text-center text-sm leading-6 text-muted-foreground">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-display font-bold text-primary hover:underline"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            New firm?{" "}
            <Link
              href="/register"
              className="font-display font-bold text-primary hover:underline"
            >
              Start a workspace
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
