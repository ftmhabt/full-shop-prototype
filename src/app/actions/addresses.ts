"use server";

import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddressInput, addressSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createAddress(data: AddressInput) {
  const userId = (await getCurrentUserId()) || "";
  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  await db.address.create({
    data: { ...parsed.data, userId },
  });

  revalidatePath("/dashboard/addresses");
  revalidatePath("/dashboard/cart/checkout");
}

export async function updateAddress(id: string, data: AddressInput) {
  const userId = (await getCurrentUserId()) as string;
  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const result = await db.address.updateMany({
    where: { id, userId },
    data: parsed.data,
  });

  if (result.count === 0) {
    throw new Error("Address not found or you do not have permission.");
  }

  revalidatePath("/dashboard/addresses");
}

export async function deleteAddress(id: string, userId: string) {
  await db.address.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard/addresses");
}

export async function getUserAddresses(userId: string) {
  const addresses = await db.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return addresses;
}

export type UserAddress = Awaited<ReturnType<typeof getUserAddresses>>;
