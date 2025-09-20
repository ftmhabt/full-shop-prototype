"use client";

import { Button } from "@/components/ui/button";
import { add, decrease, increase } from "@/store/cartSlice";
import { selectCartItems } from "@/store/selectors";
import { CartItem, ProductWithAttributes } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function QuantitySelector({
  quantity,
  product,
  size = "lg",
}: {
  quantity: number;
  product: ProductWithAttributes | CartItem | ProductWithAttributes;
  size?: "lg" | "sm";
}) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const number = items.find((i) => i.id === product.id)?.quantity ?? 0;
  return (
    <>
      {number === 0 ? (
        size === "lg" ? (
          <Button
            onClick={() =>
              dispatch(
                add({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.image?.[0] ?? "",
                })
              )
            }
            className="w-60 bg-primary text-white text-lg py-1 rounded-lg"
          >
            افزودن به سبد خرید
          </Button>
        ) : (
          <Button
            onClick={() =>
              dispatch(
                add({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.image?.[0] ?? "",
                })
              )
            }
            size="sm"
            className="absolute bottom-2 left-2 rounded-full"
            variant="secondary"
          >
            <ShoppingCart className="ml-1 h-4 w-4" /> افزودن به سبد
          </Button>
        )
      ) : size === "lg" ? (
        <div className="flex items-center justify-between p-1 border rounded-lg w-40  shadow-xs">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={() => dispatch(decrease(product.id))}
          >
            –
          </Button>
          <span className="text-lg font-bold text-primary">{number}</span>
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={() => dispatch(increase(product.id))}
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
            onClick={() => dispatch(decrease(product.id))}
          >
            –
          </Button>
          <span className="text-sm font-bold text-primary">{number}</span>
          <Button
            size="icon"
            variant="ghost"
            className="text-primary hover:bg-gray-100 w-6 h-6 rounded-full"
            onClick={() => dispatch(increase(product.id))}
          >
            +
          </Button>
        </div>
      )}
    </>
  );
}
