import { db } from "@repo/db";

export async function getTaxTypes(companyId: string) {
  try {
    return await db.query.taxType.findMany({
      where: (tax, { eq, and }) =>
        and(eq(tax.companyId, companyId), eq(tax.isArchived, false)),
      orderBy: (tax, { asc }) => asc(tax.name),
    });
  } catch (error) {
    console.error("Failed to fetch tax types:", error);
    throw new Error("Failed to fetch tax types");
  }
}
