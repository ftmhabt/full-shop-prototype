// lib/cart.ts
"use server";

import { cookies } from "next/headers";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// --- Get cart ---
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie.value) as CartItem[];
  } catch {
    return [];
  }
}

// --- Save full cart ---
export async function saveCart(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify(cart), {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// --- Add item ---
export async function addItem(item: CartItem) {
  const cart = await getCart();
  const exists = cart.find((i) => i.id === item.id);
  let updated: CartItem[];
  if (exists) {
    updated = cart.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
    );
  } else {
    updated = [...cart, item];
  }
  await saveCart(updated);
}

// --- Remove item ---
export async function removeItem(id: string) {
  const cart = await getCart();
  const updated = cart.filter((i) => i.id !== id);
  await saveCart(updated);
}

// --- Clear cart ---
export async function clearCart() {
  await saveCart([]);
}

// --- Increase / Decrease quantity ---
export async function increaseQty(id: string) {
  const cart = await getCart();
  const updated = cart.map((i) =>
    i.id === id ? { ...i, quantity: i.quantity + 1 } : i
  );
  await saveCart(updated);
}

export async function decreaseQty(id: string) {
  const cart = await getCart();
  const updated = cart.map((i) =>
    i.id === id ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 } : i
  );
  await saveCart(updated);
}
