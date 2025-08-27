"use server";

import { db } from "@/lib/db";
import { AddressInput, addressSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createAddress(userId: string, data: AddressInput) {
  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await db.address.create({
    data: { ...parsed.data, userId },
  });

  revalidatePath("/dashboard/addresses");
}

export async function updateAddress(
  id: string,
  userId: string,
  data: AddressInput
) {
  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await db.address.update({
    where: { id, userId },
    data: parsed.data,
  });

  revalidatePath("/dashboard/addresses");
}

export async function deleteAddress(id: string, userId: string) {
  await db.address.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard/addresses");
}
