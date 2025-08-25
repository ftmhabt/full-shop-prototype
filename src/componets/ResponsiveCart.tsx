"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useCart, useCartCount } from "@/store/useCart";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

// Shadcn UI
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import CartPanel from "./CartPanel";

export default function ResponsiveCart() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const totalItems = useCartCount();
  const hasHydrated = useCart((s) => s.hasHydrated);

  // Avoid hydration mismatch: don't show the badge until after hydration
  const countVisible = hasHydrated ? totalItems : 0;

  const Trigger = (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full"
      aria-label="Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {countVisible > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {countVisible}
        </span>
      )}
    </Button>
  );

  if (isDesktop) {
    // Right sidebar on desktop
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{Trigger}</SheetTrigger>
        <SheetContent side="right" className="p-6 !max-w-xl gap-0">
          <SheetHeader>
            <SheetTitle className="">سبد خرید</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <CartPanel onClose={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Bottom drawer on mobile
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
      <DrawerContent className="p-4 mb-4">
        <DrawerHeader className="px-0">
          <DrawerTitle>سبد خرید</DrawerTitle>
        </DrawerHeader>
        <CartPanel onClose={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
