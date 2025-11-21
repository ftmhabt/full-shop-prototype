"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-muted/40">
      <CardContent className="p-4 space-y-3">
        {/* Image placeholder */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Title placeholder */}
        <Skeleton className="h-4 w-3/4 mt-2" />

        {/* Price + stars row */}
        <div className="flex flex-col gap-2 items-center">
          <Skeleton className="h-4 w-16" /> {/* price */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
