"use server";

import { AddressSnapshot } from "@/components/checkout/types";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderId } from "@/lib/generateId";
import { CartItem } from "@/store/cartSlice";
import { revalidatePath } from "next/cache";
import { markDiscountUsed } from "./admin/discount";

export async function createOrder(
  items: CartItem[],
  address: AddressSnapshot,
  discountAmount: number = 0,
  shippingId: string,
  discountCode?: string
) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not found");
  if (items.length === 0) throw new Error("Cart is empty");

  // Initialize snapshot
  let shippingSnapshot = {
    id: null as string | null,
    name: null as string | null,
    cost: null as number | null,
  };

  // Fetch the shipping method
  const method = await db.shippingMethod.findUnique({
    where: { id: shippingId },
  });
  if (!method) throw new Error("روش ارسال نامعتبر است");

  // Fill snapshot
  shippingSnapshot = {
    id: method.id,
    name: method.name,
    cost: method.cost,
  };

  type DiscountTypeSnapshot = "PERCENTAGE" | "FIXED" | null;

  let discountSnapshot = {
    id: null as string | null,
    code: null as string | null,
    type: null as DiscountTypeSnapshot,
    value: null as number | null,
  };

  if (discountCode) {
    const discount = await db.discount.findUnique({
      where: { code: discountCode.toUpperCase() },
    });

    if (discount) {
      discountSnapshot = {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
      };
    }
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.priceToman * item.quantity,
    0
  );
  const finalPrice = Math.max(totalPrice + method.cost - discountAmount, 0);

  const order = await db.order.create({
    data: {
      id: generateOrderId(),
      userId,
      status: "PENDING",

      fullName: address.fullName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,

      totalPrice,
      discountAmount,
      finalPrice,

      discountId: discountSnapshot.id,
      discountCode: discountSnapshot.code,
      discountType: discountSnapshot.type,
      discountValue: discountSnapshot.value,

      shippingMethodId: shippingSnapshot.id,
      shippingMethodName: shippingSnapshot.name,
      shippingCost: shippingSnapshot.cost,

      items: {
        createMany: {
          data: items.flatMap((item) => {
            if (item.type === "BUNDLE" && item.bundleItems) {
              return item.bundleItems.map((b) => ({
                productId: b.productId,
                productName: b.name,
                productSlug: b.slug,
                productImage: b.image || null,
                quantity: b.quantity * item.quantity,
                bundleId: item.id,
                priceToman: b.priceToman,
                totalPriceToman: b.priceToman * b.quantity * item.quantity,
              }));
            }

            return {
              productId: item.id,
              productName: item.name,
              productSlug: item.slug,
              productImage: item.image || null,
              quantity: item.quantity,
              priceToman: item.priceToman,
              totalPriceToman: item.priceToman * item.quantity,
            };
          }),
        },
      },
    },
    include: { items: true, shippingMethod: true, discount: true },
  });

  await db.orderLog.create({
    data: {
      orderId: order.id,
      status: "PENDING",
      note: "سفارش ایجاد شد",
    },
  });

  if (discountSnapshot.id) {
    await markDiscountUsed(userId, discountSnapshot.id);
  }

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
      shippingMethod: true,
      logs: { orderBy: { createdAt: "desc" } },
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
