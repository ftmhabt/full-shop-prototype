"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

import { selectCartItems, selectTotalItems } from "@/store/selectors";
import { useSelector } from "react-redux";
import CartPanel from "./CartPanel";

export default function ResponsiveCart() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Redux cart
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);

  const Trigger = (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full cursor-pointer"
      aria-label="Cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </Button>
  );

  if (isDesktop) {
    // Right sidebar on desktop
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{Trigger}</SheetTrigger>
        <SheetContent side="right" className="p-6 !max-w-xl flex flex-col">
          <SheetHeader>
            <SheetTitle>سبد خرید</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto mt-4">
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
      <DrawerContent className="p-4 mb-4 flex flex-col max-h-[90vh]">
        <DrawerHeader className="px-0">
          <DrawerTitle>سبد خرید</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <CartPanel onClose={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
