"use client";

import { Button } from "@/components/ui/button";
import { add, decrease, increase } from "@/store/cartSlice";
import { selectCartItems } from "@/store/selectors";
import { CartItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function QuantitySelector({
  product,
  size = "lg",
}: {
  product: CartItem;
  size?: "lg" | "sm";
}) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const number = items.find((i) => i.id === product.id)?.quantity ?? 0;

  const handleAdd = () => {
    if (number >= product.stock) return;
    dispatch(
      add({
        id: product.id,
        name: product.name,
        slug: product.slug,
        priceToman: product.priceToman,
        quantity: 1,
        image: product.image?.[0] ?? "",
        stock: product.stock,
      })
    );
  };

  return (
    <>
      {number === 0 ? (
        size === "lg" ? (
          product.stock > 0 ? (
            <Button
              onClick={handleAdd}
              className="w-60 bg-primary text-white text-lg py-1 rounded-lg"
            >
              افزودن به سبد خرید
            </Button>
          ) : (
            <Button variant="outline" className="w-60 text-lg py-1 rounded-lg">
              ناموجود
            </Button>
          )
        ) : product.stock > 0 ? (
          <Button
            onClick={handleAdd}
            size="sm"
            className="absolute bottom-2 left-2 rounded-full"
            variant="secondary"
          >
            <ShoppingCart className="ml-1 h-4 w-4" /> افزودن به سبد
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-2 left-2 rounded-full"
          >
            ناموجود
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
            disabled={number >= product.stock}
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
            disabled={number >= product.stock}
          >
            +
          </Button>
        </div>
      )}
    </>
  );
}
