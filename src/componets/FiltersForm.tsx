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
  console.log("query", query);
  console.log("slug", slug);
  // State برای کنترل checkbox ها
  const [localFilters, setLocalFilters] =
    useState<Record<string, string[]>>(filters);

  function applyFilters(formData: FormData) {
    const currentParams = new URLSearchParams(window.location.search);

    // نگه داشتن orderBy
    const currentOrderBy = currentParams.get("orderBy");

    const params = new URLSearchParams();

    // query
    if (query) params.set("q", query);

    // orderBy رو حفظ کن
    if (currentOrderBy) params.set("orderBy", currentOrderBy);

    // فیلترها از فرم
    for (const [key, value] of formData.entries()) {
      params.append(key, String(value));
    }

    startTransition(() => {
      const url = query
        ? `/category/${slug}/search?${params.toString()}`
        : `/category/${slug}?${params.toString()}`;
      router.push(url);
      setOpen(false);

      // آپدیت state فرم با مقادیر اعمال‌شده
      const newFilters: Record<string, string[]> = {};
      for (const [key, value] of formData.entries()) {
        if (!newFilters[key]) newFilters[key] = [];
        newFilters[key].push(String(value));
      }
      setLocalFilters(newFilters);
    });
  }

  function resetFilters() {
    const params = new URLSearchParams();

    // نگه داشتن query و orderBy
    const currentParams = new URLSearchParams(window.location.search);
    const currentQ = currentParams.get("q");
    const currentOrderBy = currentParams.get("orderBy");

    if (currentQ) params.set("q", currentQ);
    if (currentOrderBy) params.set("orderBy", currentOrderBy);

    startTransition(() => {
      const url = query
        ? `/category/${slug}/search?${params.toString()}`
        : `/category/${slug}?${params.toString()}`;
      router.push(url);
      setOpen(false);

      // پاک کردن state فرم
      setLocalFilters({});
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
          checked={localFilters["inStock"]?.includes("true") ?? false}
          onCheckedChange={(checked) => {
            setLocalFilters((prev) => ({
              ...prev,
              inStock: checked ? ["true"] : [],
            }));
          }}
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
                    checked={
                      localFilters[attr.slug]?.includes(val.slug) ?? false
                    }
                    onCheckedChange={(checked) => {
                      setLocalFilters((prev) => ({
                        ...prev,
                        [attr.slug]: checked
                          ? [...(prev[attr.slug] || []), val.slug]
                          : (prev[attr.slug] || []).filter(
                              (v) => v !== val.slug
                            ),
                      }));
                    }}
                  />
                  <span>{val.value}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "در حال بارگذاری..." : "اعمال فیلتر"}
        </Button>

        {Object.keys(localFilters).length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="flex-1"
          >
            ریست فیلترها
          </Button>
        )}
      </div>
    </form>
  );

  return (
    <>
      <div className="hidden sm:block">{FilterContent}</div>

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
