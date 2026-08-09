import * as React from "react";
import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { UserShell } from "../../components/user-shell";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSafeSession(await headers());
  const user = session?.user ?? null;

  return (
    <UserShell
      user={
        user
          ? {
              name: user.name,
              email: user.email,
              image: user.image ?? undefined,
            }
          : null
      }
    >
      {children}
    </UserShell>
  );
}
