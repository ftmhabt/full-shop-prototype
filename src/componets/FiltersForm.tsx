"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AttributeWithValues } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface FiltersFormProps {
  slug?: string;
  query?: string;
  filters?: Record<string, string[]>;
  attributes?: AttributeWithValues[];
}

export default function FiltersForm({
  slug,
  query,
  filters = {},
  attributes = [],
}: FiltersFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    for (const [key, value] of formData.entries()) {
      params.append(key, String(value));
    }

    startTransition(() => {
      const url =
        !slug || slug === "search"
          ? `/search?${params}`
          : `/category/${slug}?${params}`;
      router.push(url);
      setOpen(false);
    });
  }

  const FilterContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      {/* In Stock */}
      <label className="flex items-center gap-2">
        <Checkbox
          name="inStock"
          value="true"
          defaultChecked={filters["inStock"]?.includes("true") ?? false}
        />
        <span>فقط موجودی</span>
      </label>

      {/* Attributes */}
      <Accordion type="multiple" className="w-full">
        {attributes.map((attr) => (
          <AccordionItem key={attr.id} value={attr.slug}>
            <AccordionTrigger>{attr.name}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {attr.values.map((val) => (
                <label key={val.id} className="flex items-center gap-2">
                  <Checkbox
                    name={attr.slug}
                    value={val.slug}
                    defaultChecked={
                      filters[attr.slug]?.includes(val.slug) ?? false
                    }
                  />
                  <span>{val.value}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "در حال بارگذاری..." : "اعمال فیلتر"}
      </Button>
    </form>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">{FilterContent}</div>

      {/* Mobile Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="sm:hidden w-full">
            فیلترها
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader className="text-lg font-bold">
            فیلتر محصولات
          </DrawerHeader>
          {FilterContent}
        </DrawerContent>
      </Drawer>
    </>
  );
}
