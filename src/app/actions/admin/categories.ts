"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategory(data: { name: string; slug: string }) {
  const category = await db.category.create({ data });
  revalidatePath("/admin/categories");
  return category;
}

export async function deleteCategory(id: string) {
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
