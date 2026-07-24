"use server";

import { db, eq, taxType } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function saveTaxType(data: {
  id?: string | null;
  companyId: string;
  name: string;
  rate: string;
  description?: string | null;
}) {
  try {
    const isUpdate = !!data.id;
    const taxId = data.id || `tax_${Math.random().toString(36).substring(2, 11)}`;

    const values = {
      id: taxId,
      companyId: data.companyId,
      name: data.name,
      rate: data.rate || "0.00",
      description: data.description || null,
      isArchived: false,
      updatedAt: new Date().toISOString(),
    };

    if (isUpdate) {
      await db.update(taxType).set(values).where(eq(taxType.id, taxId));
    } else {
      await db.insert(taxType).values({
        ...values,
        createdAt: new Date().toISOString(),
      });
    }

    revalidatePath("/hris/taxes");
    revalidatePath("/hris");
    return { success: true };
  } catch (error) {
    console.error("Failed to save tax type:", error);
    throw new Error("Failed to save tax type");
  }
}

export async function deleteTaxType(id: string) {
  try {
    // Per requirements, DELETE is just archive = true
    await db
      .update(taxType)
      .set({ isArchived: true, updatedAt: new Date().toISOString() })
      .where(eq(taxType.id, id));

    revalidatePath("/hris/taxes");
    revalidatePath("/hris");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tax type:", error);
    throw new Error("Failed to delete tax type");
  }
}
