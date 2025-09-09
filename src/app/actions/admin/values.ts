"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAttributeValue(data: {
  value: string;
  slug: string;
  attributeId: string;
}) {
  const value = await db.attributeValue.create({ data });
  revalidatePath(
    `/admin/categories/[catId]/attributes/${data.attributeId}/values`
  );
  return value;
}

export async function deleteAttributeValue(id: string, attributeId: string) {
  await db.attributeValue.delete({ where: { id } });
  revalidatePath(`/admin/categories/[catId]/attributes/${attributeId}/values`);
}
