"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";

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

export async function saveCart(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify(cart), {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
