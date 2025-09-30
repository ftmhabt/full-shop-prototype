"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCategory(data: {
  name: string;
  slug: string;
  icon?: string;
  inBundle: boolean;
}) {
  const category = await db.category.create({ data });
  revalidatePath("/admin/categories");
  return category;
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    icon?: string;
    inBundle: boolean;
  }
) {
  const category = await db.category.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/categories");
  return category;
}

export async function deleteCategory(id: string) {
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function getProductCategories() {
  return await db.category.findMany({
    select: { slug: true },
  });
}
