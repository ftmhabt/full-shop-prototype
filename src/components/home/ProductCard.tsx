import { FallbackImage } from "@/componets/FallbackImage";
import { cn } from "@/lib/utils";
import { ProductWithAttributes } from "@/types";
import { Percent, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Price from "./Price";

function ProductCard({ p }: { p: ProductWithAttributes }) {
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
          <Button
            size="sm"
            className="absolute bottom-2 left-2 rounded-full"
            variant="secondary"
          >
            <ShoppingCart className="ml-1 h-4 w-4" /> افزودن به سبد
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          <Link href="#" className="line-clamp-2 text-sm font-medium leading-6">
            {p.name}
          </Link>
          <div className="flex items-center justify-between">
            <Price value={p.price} old={p.oldPrice} />
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(p.rating || 0)
                      ? "fill-current"
                      : "opacity-30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
