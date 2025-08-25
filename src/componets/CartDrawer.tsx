"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  useCart,
  useCartCount,
  useCartHydrated,
  useCartTotal,
} from "@/store/useCart";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
  const count = useCartCount();
  const total = useCartTotal();

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Close cart when hydration is incomplete
  useEffect(() => {
    if (!hydrated) setOpen(false);
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="relative">
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {count}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`p-4 ${
          isDesktop
            ? "sm:max-w-md sm:right-0 sm:top-0 sm:bottom-0 sm:fixed sm:h-screen sm:rounded-none sm:translate-x-0 sm:w-[400px]"
            : ""
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${total}</span>
            </div>

            <Button variant="outline" onClick={clearCart} className="w-full">
              Clear Cart
            </Button>
            <Button variant="default" className="w-full">
              Checkout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
