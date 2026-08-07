import { db, company, eq } from "@repo/db";
import { unstable_cache } from "next/cache";

const getCachedCompany = unstable_cache(
  async (companyId: string) => {
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
  ["company"],
  { tags: ["company"] }
);

export async function getCompanyRecord(companyId: string) {
  return getCachedCompany(companyId);
}
