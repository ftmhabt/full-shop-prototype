"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// ===== SHIPPING METHODS =====
export async function getShippingMethods() {
  return await db.shippingMethod.findMany();
}

export async function addShippingMethod(formData: FormData) {
  const name = formData.get("name") as string;
  const cost = parseFloat(formData.get("cost") as string);

  if (!name || isNaN(cost)) throw new Error("Invalid data");

  await db.shippingMethod.create({ data: { name, cost } });
  revalidatePath("/dashboard/setting");
}

export async function deleteShippingMethod(id: string) {
  await db.shippingMethod.delete({ where: { id } });
  revalidatePath("/dashboard/setting");
}

// ===== CONSTANTS =====
export async function getConstants() {
  return await db.constants.findFirst();
}

export async function saveConstants(data: {
  brands: string[];
  maxFileSize: number;
  markupPercent: number;
}) {
  await db.constants.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidatePath("/dashboard/setting");
}
