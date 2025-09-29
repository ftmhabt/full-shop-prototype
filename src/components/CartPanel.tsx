"use client";

import { Button } from "@/components/ui/button";
import { clear, remove } from "@/store/cartSlice";
import { selectCartItems, selectCartTotalPrice } from "@/store/selectors";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import QuantitySelector from "../components/product details/QuantitySelector";
import { FallbackImage } from "./FallbackImage";

export default function CartPanel({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  if (items.length === 0) {
    return <p className="text-center py-8">سبد خرید خالی است</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 border rounded-lg p-2"
          >
            {/* --- Main Row --- */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <FallbackImage
                  src={
                    item.type === "BUNDLE"
                      ? "/package.png"
                      : item.image || "/fallback.png"
                  }
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded-md"
                />
                <div className="leading-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("fa-IR").format(item.price)} تومان
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <QuantitySelector product={item} quantity={item.quantity} />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => dispatch(remove(item.id))}
                  className="w-10 h-10 rounded-lg"
                >
                  <Trash className="block" />
                </Button>
              </div>
            </div>

            {/* --- Bundle Contents --- */}
            {item.type === "BUNDLE" && (item.bundleItems?.length ?? 0) > 0 && (
              <div className="pl-6 pr-2 space-y-1 text-sm text-muted-foreground">
                {item.bundleItems?.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-l-2 border-muted-foreground/30 pl-2"
                  >
                    <span>• {sub.name}</span>
                    <span>
                      {new Intl.NumberFormat("fa-IR").format(sub.price)} تومان
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- Footer --- */}
      <div className="sticky bottom-0 border-t mt-3 pt-3 space-y-3 bg-background">
        <p className="font-bold text-lg">
          مجموع: {new Intl.NumberFormat("fa-IR").format(totalPrice)} تومان
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              onClose?.();
              router.push("/dashboard/cart/checkout");
            }}
          >
            تسویه حساب
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              dispatch(clear());
              onClose?.();
            }}
          >
            خالی کردن سبد
          </Button>
        </div>
      </div>
    </div>
  );
}
