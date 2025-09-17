"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SlugFieldProps {
  value: string;
  onChange: (val: string) => void;
  productSlugs: string[];
}

export function SlugField({ value, onChange, productSlugs }: SlugFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);

  const filteredSlugs = productSlugs.filter((slug) =>
    slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (val: string) => {
    onChange(val);
    setSearch(val);
    setOpen(true);
  };

  const handleSelect = (slug: string) => {
    onChange(slug);
    setSearch(slug);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <Input
        id="slug"
        placeholder="اسلاگ دسته"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && filteredSlugs.length > 0 && (
        <div className="border rounded-md mt-1 max-h-40 overflow-auto bg-white shadow-md">
          <Command>
            <CommandInput
              placeholder="جستجوی slug..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>هیچ اسلاگی یافت نشد</CommandEmpty>
            <CommandGroup>
              {filteredSlugs.map((slug) => (
                <CommandItem key={slug} onSelect={() => handleSelect(slug)}>
                  {slug}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-1">
        برای نمایش محصولات مرتبط، اسلاگ این دسته‌بندی باید دقیقا با اسلاگ
        دسته‌بندی محصولات یکی باشد. اگر نمی‌خواهید دسته‌بندی محصولی به آن وصل
        شود، می‌توانید اسلاگ دلخواه خود را وارد کنید.
      </p>
    </div>
  );
}
