import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";
import { AuthShell } from "../../components/auth-shell";

export const metadata: Metadata = {
  title: "Start a workspace",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Open your Dalia workspace"
      subtitle="For accounting firms handling MSME payrolls—compliance without the Excel grind. Beta partners get lifetime 50% off."
    >
      <AuthForm mode="register" error={error} />
    </AuthShell>
  );
}
