"use client";

import { CartItem } from "@/app/actions/cart";
import { ProductWithAttribute } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { useCartServer } from "@/hooks/useCartServer";
import { ProductWithAttributes } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function QuantitySelector({
  quantity,
  product,
  size = "lg",
}: {
  quantity: number;
  product: ProductWithAttribute | CartItem | ProductWithAttributes;
  size?: "lg" | "sm";
}) {
  const { add, increase, decrease } = useCartServer();

  // Local optimistic quantity state
  const [optimisticQuantity, setOptimisticQuantity] = useState(quantity);

  // keep it in sync if parent changes
  useEffect(() => {
    setOptimisticQuantity(quantity);
  }, [quantity]);

  const handleAddToCart = async () => {
    // Optimistically update
    setOptimisticQuantity(1);

    try {
      await add({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      toast.success(`${product.name} به سبد اضافه شد`);
    } catch (error) {
      // rollback on failure
      setOptimisticQuantity(0);
      toast.error("مشکلی پیش آمد، دوباره تلاش کنید");
    }
  };

  const handleIncrease = async () => {
    setOptimisticQuantity((q) => q + 1);

    try {
      await increase(product.id);
    } catch (error) {
      setOptimisticQuantity((q) => q - 1); // rollback
      toast.error("افزایش تعداد انجام نشد");
    }
  };

  const handleDecrease = async () => {
    setOptimisticQuantity((q) => Math.max(q - 1, 0));

    try {
      await decrease(product.id);
    } catch (error) {
      setOptimisticQuantity((q) => q + 1); // rollback
      toast.error("کاهش تعداد انجام نشد");
    }
  };

  return (
    <>
      {optimisticQuantity === 0 ? (
        size === "lg" ? (
          <Button
            onClick={handleAddToCart}
            className="w-60 bg-primary text-white text-lg py-1 rounded-lg"
          >
            افزودن به سبد خرید
          </Button>
        ) : (
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="absolute bottom-2 left-2 rounded-full"
            variant="secondary"
          >
            <ShoppingCart className="ml-1 h-4 w-4" /> افزودن به سبد
          </Button>
        )
      ) : size === "lg" ? (
        <div className="flex items-center justify-between p-1 border rounded-lg w-40 bg-white shadow-xs">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={handleDecrease}
          >
            –
          </Button>
          <span className="text-lg font-bold text-primary">
            {optimisticQuantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={handleIncrease}
          >
            +
          </Button>
        </div>
      ) : (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-secondary rounded-full px-2 py-1 shadow-md">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-6 h-6 rounded-full"
            onClick={handleDecrease}
          >
            –
          </Button>
          <span className="text-sm font-bold text-primary">
            {optimisticQuantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-6 h-6 rounded-full"
            onClick={handleIncrease}
          >
            +
          </Button>
        </div>
      )}
    </>
  );
}
