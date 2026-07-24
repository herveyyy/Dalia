import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTaxTypes } from "../utils/queries/tax-queries";
import { TaxList } from "../utils/components/tax-list";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const taxTypesList = user.companyId ? await getTaxTypes(user.companyId) : [];

  return (
    <TaxList taxTypes={taxTypesList} companyId={user.companyId || ""} />
  );
}
