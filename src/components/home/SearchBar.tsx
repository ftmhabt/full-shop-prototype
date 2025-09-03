"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* دسکتاپ */}
      <form
        action="/search"
        method="get"
        className="hidden sm:flex flex-1 max-w-xl items-center gap-2"
      >
        <Input
          type="text"
          name="q"
          placeholder="جستجوی محصولات..."
          className="rounded-full w-full"
        />
        <Button type="submit" size="icon" className="rounded-full">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* موبایل */}
      <div className="sm:hidden">
        <Drawer open={open} onOpenChange={setOpen} direction="top">
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>جستجو</DrawerTitle>
            </DrawerHeader>
            <form
              action="/search"
              method="get"
              className="flex items-center gap-2"
              onSubmit={() => setOpen(false)}
            >
              <Input
                type="text"
                name="q"
                placeholder="جستجوی محصولات..."
                className="rounded-full flex-1"
                autoFocus
              />
              <Button type="submit" size="icon" className="rounded-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
