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

  // ---------------------------------------------
  //  STEP 1 — Stock Validation Before Creating Order
  // ---------------------------------------------
  for (const item of items) {
    // Normal product
    if (!item.type || item.type === "PRODUCT") {
      const product = await db.product.findUnique({
        where: { id: item.id },
        select: { stock: true, name: true },
      });

      if (!product) throw new Error("محصول یافت نشد");
      if (product.stock < item.quantity)
        throw new Error(`موجودی محصول «${product.name}» کافی نیست`);
    }

    // Bundle product → check each included item
    if (item.type === "BUNDLE" && item.bundleItems) {
      for (const b of item.bundleItems) {
        const product = await db.product.findUnique({
          where: { id: b.productId },
          select: { stock: true, name: true },
        });

        if (!product) throw new Error("محصول یافت نشد");

        const neededQty = b.quantity * item.quantity;

        if (product.stock < neededQty)
          throw new Error(
            `موجودی محصول «${product.name}» برای این بسته کافی نیست`
          );
      }
    }
  }
  // ---------------------------------------------

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

  // ---------------------------------------------
  //  STEP 2 — Create Order (stock already validated)
  // ---------------------------------------------
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
    include: { items: true },
  });
  if (!order) throw new Error("سفارش پیدا نشد");

  const data: any = { status: newStatus };

  if (newStatus === "PAID") {
    await db.$transaction(async (tx) => {
      for (const item of order.items) {
        if (!item.productId) continue;

        // 1 Fetch current stock
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (!product) throw new Error("محصول یافت نشد");

        // 2 Check stock before decrement
        if (product.stock < item.quantity) {
          throw new Error(`موجودی محصول ${item.productName} کافی نیست`);
        }

        // 3 Apply decrement + soldCount increment
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      // 4 Update payment status safely
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          paidAt: now,
        },
      });
    });
  } else if (newStatus === "SHIPPED") {
    data.shippedAt = now;
    if (trackingCode) data.trackingCode = trackingCode;
  } else if (newStatus === "COMPLETED") {
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
          : newStatus === "PAID"
          ? "پرداخت با موفقیت تایید شد"
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
