"use server";

import { AddressSnapshot } from "@/components/checkout/types";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { CartItem } from "@/types";

export async function createOrder(
  items: CartItem[],
  address: AddressSnapshot,
  discount: number = 0,
  shippingId: string
) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not found");
  if (items.length === 0) throw new Error("Cart is empty");

  const method = await db.shippingMethod.findUnique({
    where: { id: shippingId },
  });
  if (!method) throw new Error("روش ارسال نامعتبر است");

  // محاسبه مبلغ کل
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const finalPrice = totalPrice + method.cost - discount;

  const order = await db.order.create({
    data: {
      userId,
      status: "PENDING",

      // snapshot آدرس
      fullName: address.fullName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,

      // مالی
      totalPrice,
      discount,
      finalPrice,

      // آیتم‌ها
      items: {
        create: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },

      // ارسال
      shippingMethodId: shippingId,
    },
    include: { items: true, ShippingMethod: true },
  });

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: "PAID" | "CANCELED" | "SHIPPED" | "COMPLETED"
) {
  return db.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "PENDING" | "PAID" | "FAILED"
) {
  return db.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });
}

export async function getUserOrders() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("کاربر یافت نشد");

  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}
