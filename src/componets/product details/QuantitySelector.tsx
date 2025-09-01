"use client";

import { CartItem } from "@/app/actions/cart";
import { ProductWithAttribute } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { useCartServer } from "@/hooks/useCartServer";
import { ProductWithAttributes } from "@/types";
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
  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  return (
    <>
      {quantity === 0 ? (
        size === "lg" ? (
          <Button
            onClick={handleAddToCart}
            className="w-60 bg-primary text-white text-lg py-6 rounded-lg"
          >
            افزودن به سبد خرید
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleAddToCart}
            className="w-40  py-6 rounded-lg shadow-xs"
          >
            افزودن به سبد خرید
          </Button>
        )
      ) : (
        <div className="flex items-center justify-between p-2 border rounded-lg w-40 bg-white shadow-xs">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={() => decrease(product.id)}
          >
            –
          </Button>
          <span className="text-lg font-bold text-primary">{quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={() => increase(product.id)}
          >
            +
          </Button>
        </div>
      )}
    </>
  );
}
