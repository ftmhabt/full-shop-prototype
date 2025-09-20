"use server";

import { AddressSnapshot } from "@/components/checkout/types";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderId } from "@/lib/generateId";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";

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
      id: generateOrderId(),
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

  // اولین لاگ (PENDING)
  await db.orderLog.create({
    data: {
      orderId: order.id,
      status: "PENDING",
      note: "سفارش ایجاد شد",
    },
  });

  return order;
}

export async function getUserOrders() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("کاربر یافت نشد");

  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
      ShippingMethod: true,
      OrderLog: { orderBy: { createdAt: "desc" } },
    },
  });

  return orders;
}

export async function changeOrderStatus(
  orderId: string,
  newStatus: "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED",
  trackingCode?: string
) {
  const now = new Date();

  // سفارش فعلی
  const order = await db.order.findUnique({
    where: { id: orderId },
  });
  if (!order) throw new Error("سفارش پیدا نشد");

  const data: any = { status: newStatus };

  // بر اساس وضعیت جدید، تایم‌ها و کد رهگیری ثبت میشه
  if (newStatus === "PAID") {
    data.paidAt = now;
  }
  if (newStatus === "SHIPPED") {
    data.shippedAt = now;
    if (trackingCode) data.trackingCode = trackingCode;
  }
  if (newStatus === "COMPLETED") {
    data.deliveredAt = now;
  }

  // آپدیت سفارش
  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data,
  });

  // لاگ
  await db.orderLog.create({
    data: {
      orderId,
      status: newStatus,
      note:
        newStatus === "SHIPPED" && trackingCode
          ? `سفارش ارسال شد - کد رهگیری: ${trackingCode}`
          : undefined,
    },
  });
  revalidatePath(`/admin/orders`);
  return updatedOrder;
}

export async function changePaymentStatus(
  orderId: string,
  newStatus: "PENDING" | "PAID" | "FAILED"
) {
  const now = new Date();

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("سفارش پیدا نشد");

  const data: any = { paymentStatus: newStatus };
  if (newStatus === "PAID") data.paidAt = now;

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data,
  });

  revalidatePath(`/orders/${orderId}`);

  return updatedOrder;
}
