import { db, eq, employee } from "@repo/db";

export async function postDeleteEmployee(id: string) {
  try {
    await db.delete(employee).where(eq(employee.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete employee:", error);
    throw new Error("Failed to delete employee");
  }
}
