"use server";

import { auth } from "@repo/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function fail(path: "/login" | "/register", error: unknown) {
  const message =
    error instanceof APIError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signInAction(formData: FormData) {
  try {
    await auth.api.signInEmail({
      body: {
        email: field(formData, "email"),
        password: field(formData, "password"),
      },
    });
  } catch (error) {
    fail("/login", error);
  }
  redirect("/");
}

export async function signUpAction(formData: FormData) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: field(formData, "name"),
        email: field(formData, "email"),
        password: field(formData, "password"),
        companyName: field(formData, "companyName"),
      },
    });
  } catch (error) {
    fail("/register", error);
  }
  redirect("/");
}
