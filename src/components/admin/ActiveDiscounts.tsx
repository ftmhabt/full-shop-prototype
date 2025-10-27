"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveDiscounts({
  discounts,
}: {
  discounts: {
    id: string;
    code: string;
    description: string;
    type: string;
    value: number;
    expiresAt?: Date | null;
    neverExpires: boolean;
  }[];
}) {
  return (
    <Card className="col-span-2 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          تخفیف‌های فعال
        </CardTitle>
      </CardHeader>
      <CardContent>
        {discounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">هیچ تخفیفی فعال نیست.</p>
        ) : (
          <div className="space-y-2">
            {discounts.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between border-b last:border-0 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{d.code}</span>
                  <span className="text-xs text-muted-foreground">
                    {d.description}
                  </span>
                </div>
                <div className="text-left text-xs">
                  <span className="block font-medium">
                    {d.type === "PERCENTAGE"
                      ? `${d.value}%`
                      : `${d.value.toLocaleString()} تومان`}
                  </span>
                  <span className="text-muted-foreground">
                    {d.neverExpires
                      ? "دائمی"
                      : `تا ${new Date(d.expiresAt!).toLocaleDateString(
                          "fa-IR"
                        )}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
