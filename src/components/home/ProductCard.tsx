"use client";
import QuantitySelector from "@/components/product details/QuantitySelector";
import { selectCartItems } from "@/store/selectors";
import { ProductWithAttributes } from "@/types";
import { Percent } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FallbackImage } from "../FallbackImage";
import Rating from "../product details/Rating";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import Price from "./Price";

function ProductCard({ p }: { p: ProductWithAttributes }) {
  const items = useSelector(selectCartItems);

  const cartItem = items.find((i) => i.id === p.id);
  const quantity = cartItem?.quantity || 0;

  const averageRating =
    p.reviews.length > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0;

  const product = {
    ...p,
    price: p.price.toNumber(),
    oldPrice: p.oldPrice?.toNumber(),
  };
  return (
    <Card className="group overflow-hidden rounded-2xl border-muted/40">
      <CardContent className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <FallbackImage
            src={product.image[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.badge && (
            <Badge className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs">
              <Percent className="ml-1 h-3 w-3" /> {product.badge}
            </Badge>
          )}
          <QuantitySelector product={p} quantity={quantity} size="sm" />
        </div>
        <div className="mt-3 space-y-2">
          <Link
            href={"/product/" + product.slug}
            className="line-clamp-2 text-sm font-medium leading-6 h-12 flex items-center"
          >
            {product.name}
          </Link>
          <div className="flex flex-col gap-2 items-center justify-between">
            <Price value={product.price} old={product.oldPrice} />
            <Rating value={averageRating} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
