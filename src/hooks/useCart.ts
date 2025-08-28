"use client";

import { CartItem } from "@/types";
import { useState } from "react";

export function useCart(initialCart: CartItem[] = []) {
  const [items, setItems] = useState<CartItem[]>(initialCart);

  const addItem = (item: CartItem) => {
    const exists = items.find((i) => i.id === item.id);
    let updated;
    if (exists) {
      updated = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      updated = [...items, item];
    }
    setItems(updated);
    syncCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    syncCart(updated);
  };

  const increaseQty = (id: string) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    setItems(updated);
    syncCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = items.map((i) =>
      i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
    );
    setItems(updated);
    syncCart(updated);
  };

  const clearCart = () => {
    setItems([]);
    syncCart([]);
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const syncCart = async (cart: CartItem[]) => {
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify(cart),
    });
  };

  return {
    items,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    totalPrice,
  };
}
