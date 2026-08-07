"use server";

import { db, eq, taxType, logActivity } from "@repo/db";
import { getSafeSession } from "@repo/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
  const session = await getSafeSession(await headers());
  return session?.user ?? null;
}

export async function saveTaxType(data: {
  id?: string | null;
  companyId: string;
  name: string;
  rate: string;
  description?: string | null;
}) {
  try {
    const user = await getSessionUser();
    const isUpdate = !!data.id;

    const values = {
      companyId: data.companyId,
      name: data.name,
      rate: data.rate || "0.00",
      description: data.description || null,
      isArchived: false,
      updatedAt: new Date().toISOString(),
    };

    let oldRecord: any = null;
    let newRecord: any = null;
    let taxId = data.id ?? null;

    if (isUpdate && data.id) {
      [oldRecord] = await db.select().from(taxType).where(eq(taxType.id, data.id));
      [newRecord] = await db.update(taxType).set(values).where(eq(taxType.id, data.id)).returning();
    } else {
      [newRecord] = await db
        .insert(taxType)
        .values({
          ...values,
          createdAt: new Date().toISOString(),
        })
        .returning();
      taxId = newRecord?.id ?? null;
    }

    if (taxId && newRecord) {
      await logActivity(db, {
        companyId: data.companyId,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        entityType: "tax_type",
        entityId: taxId,
        action: isUpdate ? "UPDATE" : "CREATE",
        summary: isUpdate ? `Updated tax setting "${data.name}"` : `Created tax setting "${data.name}"`,
        oldData: oldRecord || null,
        newData: newRecord || null,
      });
    }

    revalidatePath("/hris/taxes");
    revalidatePath("/hris");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to save tax type:", error);
    throw new Error("Failed to save tax type");
  }
}

export async function deleteTaxType(id: string) {
  try {
    const user = await getSessionUser();

    const [oldRecord] = await db.select().from(taxType).where(eq(taxType.id, id));
    const [newRecord] = await db
      .update(taxType)
      .set({ isArchived: true, updatedAt: new Date().toISOString() })
      .where(eq(taxType.id, id))
      .returning();

    if (oldRecord && newRecord) {
      await logActivity(db, {
        companyId: oldRecord.companyId,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        entityType: "tax_type",
        entityId: id,
        action: "ARCHIVE",
        summary: `Archived tax setting "${oldRecord.name}"`,
        oldData: oldRecord,
        newData: newRecord,
      });
    }

    revalidatePath("/hris/taxes");
    revalidatePath("/hris");
    revalidatePath("/hris/activity-logs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tax type:", error);
    throw new Error("Failed to delete tax type");
  }
}
