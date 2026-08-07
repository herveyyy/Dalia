import { db, taxType, eq, and, ilike, sql } from "@repo/db";

export interface GetTaxTypesParams {
  companyId: string;
  page?: number;
  itemsPerPage?: number;
  search?: string;
}

export async function getTaxTypes(params: GetTaxTypesParams | string) {
  try {
    const companyId = typeof params === "string" ? params : params.companyId;
    const page = typeof params === "string" ? 1 : params.page || 1;
    const itemsPerPage = typeof params === "string" ? 100 : params.itemsPerPage || 10;
    const search = typeof params === "string" ? undefined : params.search;

    const offset = (page - 1) * itemsPerPage;

    const conditions: any[] = [
      eq(taxType.companyId, companyId),
      eq(taxType.isArchived, false),
    ];

    if (search && search.trim()) {
      conditions.push(ilike(taxType.name, `%${search.trim()}%`));
    }

    const whereClause = and(...conditions);

    const [list, [totalResult]] = await Promise.all([
      db
        .select()
        .from(taxType)
        .where(whereClause)
        .orderBy(taxType.name)
        .limit(itemsPerPage)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)` })
        .from(taxType)
        .where(whereClause),
    ]);

    return {
      taxTypes: list,
      totalCount: Number(totalResult?.total ?? 0),
    };
  } catch (error) {
    console.error("Failed to fetch tax types:", error);
    return { taxTypes: [], totalCount: 0 };
  }
}
