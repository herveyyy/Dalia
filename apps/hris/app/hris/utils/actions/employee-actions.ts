"use server";

import { postSaveEmployee } from "../queries/post/post-save-employee.query";
import { postDeleteEmployee } from "../queries/post/post-delete-employee.query";
import { revalidatePath } from "next/cache";

export async function saveEmployee(data: any) {
  const result = await postSaveEmployee(data);
  revalidatePath("/hris");
  return result;
}

export async function deleteEmployee(id: string) {
  const result = await postDeleteEmployee(id);
  revalidatePath("/hris");
  return result;
}
