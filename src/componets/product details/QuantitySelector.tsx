"use client";

import { Button } from "@/components/ui/button";

export default function QuantitySelector({
  qty,
  setQty,
}: {
  qty: number;
  setQty: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setQty(Math.max(1, qty - 1))}
      >
        -
      </Button>
      <span className="px-3">{qty}</span>
      <Button size="sm" variant="outline" onClick={() => setQty(qty + 1)}>
        +
      </Button>
    </div>
  );
}
