"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FallbackImage } from "../FallbackImage";

export function LowStockProducts({
  products,
}: {
  products: {
    id: string;
    name: string;
    stock: number;
    soldCount: number;
    image?: string | null;
  }[];
}) {
  return (
    <Card className="col-span-3 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          محصولات رو به اتمام
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            همه محصولات موجود هستند 🎉
          </p>
        ) : (
          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b last:border-0 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <FallbackImage
                      width={100}
                      height={100}
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-md" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      فروش: {p.soldCount.toLocaleString()} | موجودی: {p.stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
