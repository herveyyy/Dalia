"use server";

import { auth } from "@repo/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import { db, company } from "@repo/db";

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
  redirect("/apps");
}

export async function signUpAction(formData: FormData) {
  try {
    const companyId = crypto.randomUUID();
    const companyName = field(formData, "companyName");

    const result = await auth.api.signUpEmail({
      body: {
        name: field(formData, "name"),
        email: field(formData, "email"),
        password: field(formData, "password"),
        companyId: companyId,
      },
    });

    if (result?.user?.id) {
      // 2. Create the company with the user's generated ID
      await db.insert(company).values({
        id: companyId,
        name: companyName,
        createdBy: result.user.id,
      });
    } else {
      throw new Error("Failed to retrieve registered user profile.");
    }
  } catch (error) {
    fail("/register", error);
  }
  redirect("/apps");
}
