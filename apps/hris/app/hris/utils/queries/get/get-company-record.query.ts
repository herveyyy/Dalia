import { db, company, eq } from "@repo/db";

export async function getCompanyRecord(companyId: string) {
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
}
