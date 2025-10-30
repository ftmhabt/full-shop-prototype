"use server";

import { getCurrentUserId } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// -------------------------------
// Admin: create or update discount
// -------------------------------
export async function saveDiscount(formData: FormData) {
  const code = formData.get("code")?.toString().trim().toUpperCase();
  const type = formData.get("type")?.toString() as "PERCENTAGE" | "FIXED";
  const value = Number(formData.get("value"));
  const expiresAtRaw = formData.get("expiresAt")?.toString();
  const neverExpires = formData.get("neverExpires") !== null;
  const description = formData.get("description")?.toString() || "";

  if (!code || !type || !value) throw new Error("Invalid discount data");

  const expiresAt =
    !neverExpires && expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (expiresAt && isNaN(expiresAt.getTime())) {
    throw new Error("Invalid expiresAt date");
  }

  await db.discount.upsert({
    where: { code },
    create: {
      code,
      type,
      value,
      description,
      neverExpires,
      expiresAt,
    },
    update: {
      type,
      value,
      description,
      neverExpires,
      expiresAt,
    },
  });

  revalidatePath("/admin/discounts");
}

// -------------------------------
// Admin: get all discounts
// -------------------------------
export async function getDiscounts() {
  const discounts = await db.discount.findMany({
    orderBy: { createdAt: "desc" },
  });

  return discounts.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    expiresAt: d.expiresAt ? d.expiresAt.toISOString() : null,
  }));
}

// -------------------------------
// User: apply discount code
// -------------------------------
export async function applyDiscount(code: string, itemsTotal: number) {
  const userId = await getCurrentUserId();

  if (!userId) throw new Error("Not authenticated");

  const discount = await db.discount.findUnique({
    where: { code: code.toUpperCase() },
    include: { uses: { where: { userId } } },
  });

  if (!discount || !discount.isActive) {
    throw new Error("کد تخفیف معتبر نیست");
  }

  if (
    !discount.neverExpires &&
    discount.expiresAt &&
    discount.expiresAt < new Date()
  ) {
    throw new Error("کد تخفیف منقضی شده است");
  }

  if (discount.uses.length > 0) {
    throw new Error("شما قبلاً از این کد استفاده کرده‌اید");
  }

  const amount =
    discount.type === "PERCENTAGE"
      ? Math.round((itemsTotal * discount.value) / 100)
      : discount.value;

  return {
    amount,
    discountId: discount.id,
    description: discount.description,
    code: discount.code,
  };
}

// -------------------------------
// After successful order payment
// -------------------------------
export async function markDiscountUsed(userId: string, discountId: string) {
  if (!userId || !discountId) return;

  const alreadyUsed = await db.discountUse.findUnique({
    where: { userId_discountId: { userId, discountId } },
  });

  if (alreadyUsed) return; // already marked as used

  await db.discountUse.create({
    data: { userId, discountId },
  });
}

export async function updateDiscountStatus(id: string, isActive: boolean) {
  try {
    await db.discount.update({
      where: { id },
      data: { isActive },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating discount status:", error);
    return { success: false };
  }
}

export async function deleteDiscount(id: string) {
  try {
    await db.discount.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting discount:", error);
    return { success: false };
  }
}
