import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTaxTypes } from "../utils/queries/tax-queries";
import { TaxList } from "../utils/components/tax-list";

export default async function Page(props: {
  searchParams?: Promise<{ page?: string; items?: string; q?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page || 1);
  const items = Number(searchParams?.items || 10);
  const search = searchParams?.q || searchParams?.search || "";

  const session = await getSafeSession(await headers());

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  const { taxTypes, totalCount } = user.companyId
    ? await getTaxTypes({
        companyId: user.companyId,
        page,
        itemsPerPage: items,
        search,
      })
    : { taxTypes: [], totalCount: 0 };

  return (
    <TaxList
      taxTypes={taxTypes}
      totalCount={totalCount}
      companyId={user.companyId || ""}
      page={page}
      itemsPerPage={items}
      search={search}
    />
  );
}
