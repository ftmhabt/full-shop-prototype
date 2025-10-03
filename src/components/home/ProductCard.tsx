"use client";
import QuantitySelector from "@/components/product details/QuantitySelector";
import { selectCartItems } from "@/store/selectors";
import { Percent } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FallbackImage } from "../FallbackImage";
import Rating from "../product details/Rating";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { StandardizedProduct } from "./HotProducts";
import Price from "./Price";

function ProductCard({ p }: { p: StandardizedProduct }) {
  const items = useSelector(selectCartItems);

  const cartItem = items.find((i) => i.id === p.id);
  const quantity = cartItem?.quantity || 0;

  const averageRating =
    p.reviews.length > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border-muted/40">
      <CardContent className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <FallbackImage
            src={p.image[0]}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {p.badge && (
            <Badge className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs">
              <Percent className="ml-1 h-3 w-3" /> {p.badge}
            </Badge>
          )}
          <QuantitySelector product={p} quantity={quantity} size="sm" />
        </div>
        <div className="mt-3 space-y-2">
          <Link
            href={"/p/" + p.slug}
            className="line-clamp-2 text-sm font-medium leading-6 h-12 flex items-center"
          >
            {p.name}
          </Link>
          <div className="flex flex-col gap-2 items-center justify-between">
            <Price value={p.price} old={p.oldPrice} />
            <Rating value={averageRating} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
