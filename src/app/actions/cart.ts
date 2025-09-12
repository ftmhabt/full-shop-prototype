"use server";

import { getCurrentUserId } from "@/lib/auth";
import db from "@/lib/db";

// --- Get cart for current user ---
export async function getCart() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const cart = await db.cart.findFirst({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!cart) return [];

  return cart.items.map((it) => ({
    id: it.productId,
    quantity: it.quantity,
    price: it.product.price,
    name: it.product.name,
    image: it.product.image[0] ?? null,
  }));
}

// --- Replace entire cart with given items ---
export async function syncCart(items: { id: string; quantity: number }[]) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  const cart = await db.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  await db.$transaction(async (tx) => {
    // remove items not included
    const keepIds = items.map((i) => i.id);
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: { notIn: keepIds.length ? keepIds : ["__none__"] },
      },
    });

    // upsert each provided item
    for (const it of items) {
      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: it.id } },
        create: { cartId: cart.id, productId: it.id, quantity: it.quantity },
        update: { quantity: it.quantity },
      });
    }
  });

  return getCart();
}

// --- Merge guest cart into user cart (at login) ---
export async function mergeCart(items: { id: string; quantity: number }[]) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  const cart = await db.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  await db.$transaction(async (tx) => {
    for (const it of items) {
      const existing = await tx.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId: it.id } },
      });
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + it.quantity },
        });
      } else {
        await tx.cartItem.create({
          data: { cartId: cart.id, productId: it.id, quantity: it.quantity },
        });
      }
    }
  });

  return getCart();
}

// --- Clear cart ---
export async function clearCart() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  const cart = await db.cart.findFirst({ where: { userId } });
  if (!cart) return;

  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
}
