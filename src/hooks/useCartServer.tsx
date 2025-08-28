"use client";

import {
  addItem,
  CartItem,
  clearCart,
  decreaseQty,
  getCart,
  increaseQty,
  removeItem,
} from "@/app/actions/cart";
import { useEffect, useState, useTransition } from "react";

export function useCartServer() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();

  // --- لود اولیه سبد خرید ---
  useEffect(() => {
    startTransition(async () => {
      const cart = await getCart();
      setItems(cart);
    });
  }, []);

  const syncAndUpdate = (fn: () => Promise<void>) => {
    startTransition(async () => {
      await fn();
      const updated = await getCart();
      setItems(updated);
    });
  };

  const add = (item: CartItem) => syncAndUpdate(() => addItem(item));

  const remove = (id: string) => syncAndUpdate(() => removeItem(id));

  const increase = (id: string) => syncAndUpdate(() => increaseQty(id));

  const decrease = (id: string) => syncAndUpdate(() => decreaseQty(id));

  const clear = () => syncAndUpdate(() => clearCart());

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    items,
    totalPrice,
    isPending,
    add,
    remove,
    increase,
    decrease,
    clear,
  };
}
