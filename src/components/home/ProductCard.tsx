"use client";
import QuantitySelector from "@/components/product details/QuantitySelector";
import { selectCartItems } from "@/store/selectors";
import { StandardizedProduct } from "@/types";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FallbackImage } from "../FallbackImage";
import Rating from "../product details/Rating";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import Price from "./Price";

function ProductCard({ p }: { p: StandardizedProduct }) {
  const items = useSelector(selectCartItems);

  const cartItem = items.find((i) => i.id === p.id);
  const quantity = cartItem?.quantity || 0;

  const averageRating =
    p.reviews.length > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0;

  const discountPercent = p.oldPriceToman
    ? Math.round(((p.oldPriceToman - p.priceToman) / p.oldPriceToman) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border-muted/40">
      <CardContent className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <FallbackImage
            src={p.image[0]}
            alt={p.name}
            width={300}
            height={300}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex gap-1 absolute right-2 top-2 ">
            {p.badge && (
              <Badge className="rounded-full px-3 py-1 text-xs">
                {p.badge}
              </Badge>
            )}
            {p.oldPriceToman && (
              <Badge className="rounded-full px-3 py-1 text-xs">
                {discountPercent + "%"}
              </Badge>
            )}
          </div>

          <QuantitySelector
            product={{
              id: p.id,
              name: p.name,
              slug: p.slug,
              priceToman: p.priceToman,
              quantity,
              image: p.image?.[0] ?? "",
            }}
            size="sm"
          />
        </div>
        <div className="mt-3 space-y-2">
          <Link
            href={"/product/" + p.slug}
            className="line-clamp-2 text-sm font-medium leading-6 h-12 flex items-center"
          >
            {p.name}
          </Link>
          <div className="flex flex-col gap-2 items-center justify-between">
            <Price value={p.priceToman} old={p.oldPriceToman} />
            <Rating value={averageRating} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
