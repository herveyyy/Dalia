import { db, company, eq } from "@repo/db";
import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

const getCachedCompany = (companyId: string) =>
  unstable_cache(
    async () => {
      try {
        const [companyRecord] = await db
          .select()
          .from(company)
          .where(eq(company.id, companyId))
          .limit(1);

        return companyRecord ?? null;
      } catch (error) {
        console.error("Failed to fetch company record:", error);
        throw new Error("Failed to fetch company record");
      }
    },
    [`company-${companyId}`],
    { tags: [`company-${companyId}`] }
  )();

export async function getCompanyRecord(companyId: string) {
  return getCachedCompany(companyId);
}
