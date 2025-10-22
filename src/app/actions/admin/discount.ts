"use server";

import db from "@/lib/db";

// fetch first-time and global discounts
export async function getDiscounts() {
  return await db.discount.findMany({
    where: { OR: [{ isFirstTimeBuyer: true }, { isGlobal: true }] },
  });
}

// save or update a discount
export async function saveDiscount(formData: FormData) {
  const type = formData.get("type") as "first" | "global";
  const value = Number(formData.get("value"));
  const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED";
  const isActive = formData.get("isActive") === "true";
  const expiresAtRaw = formData.get("expiresAt") as string | null;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  const data =
    type === "first"
      ? { isFirstTimeBuyer: true }
      : { isGlobal: true, expiresAt };

  // Optionally deactivate previous active discount of the same type
  if (isActive) {
    await db.discount.updateMany({
      where: {
        isActive: true,
        isFirstTimeBuyer: type === "first",
        isGlobal: type === "global",
      },
      data: { isActive: false },
    });
  }

  await db.discount.create({
    data: {
      code: type === "first" ? "FIRSTTIME" : "GLOBAL",
      description:
        type === "first" ? "تخفیف خریدار اول" : "تخفیف عمومی فروش ویژه",
      value,
      type: discountType,
      isActive,
      ...data,
    },
  });
}

export async function getDiscountHistory(type: "first" | "global") {
  return await db.discount.findMany({
    where: type === "first" ? { isFirstTimeBuyer: true } : { isGlobal: true },
    orderBy: { createdAt: "desc" },
  });
}
