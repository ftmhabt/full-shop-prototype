"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCartServer } from "@/hooks/useCartServer";
import { ProductWithAttributes } from "@/types";
import toast from "react-hot-toast";
import { FallbackImage } from "./FallbackImage";

export default function ProductCard({
  product,
}: {
  product: ProductWithAttributes;
}) {
  const { items, add, increase, decrease } = useCartServer();

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image[0],
      quantity: 1,
    });
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  return (
    <Card className="flex flex-col gap-0 rounded-2xl shadow hover:shadow-lg transition">
      <CardHeader>
        <FallbackImage
          src={product.image[0]}
          fallbackSrc="/fallback.png"
          alt={product.name}
          width={400}
          height={160}
          className="w-full h-40 object-contain"
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-2 text-center">
        <h2 className="text-base font-semibold">{product.name}</h2>
        <p className="text-primary font-bold text-lg">
          {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
        </p>
      </CardContent>

      <CardFooter className="flex justify-center mt-3">
        {quantity === 0 ? (
          <Button onClick={handleAddToCart} variant="outline" size="sm">
            +
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => decrease(product.id)}
            >
              -
            </Button>
            <span className="w-6 text-center">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => increase(product.id)}
            >
              +
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
