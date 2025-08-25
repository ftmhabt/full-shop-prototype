"use client";
import { useCart } from "@/store/useCart";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function CartIcon() {
  const totalItems = useCart((state) => state.totalItems);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>
      <CartDrawer open={open} setOpen={setOpen} />
    </>
  );
}
