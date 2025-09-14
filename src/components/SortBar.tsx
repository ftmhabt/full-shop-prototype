"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const options = [
  { label: "جدیدترین", value: "newest" },
  { label: "قدیمی‌ترین", value: "oldest" },
  { label: "ارزان‌ترین", value: "priceAsc" },
  { label: "گران‌ترین", value: "priceDesc" },
];

export default function SortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = searchParams.get("orderBy") || "newest";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderBy", value); // preserve all filters

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex justify-end w-full sm:w-48">
      <Select value={current} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-full border rounded-md px-3 py-2  flex items-center justify-between">
          <SelectValue placeholder="مرتب سازی" />
          {isPending && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
        </SelectTrigger>
        <SelectContent className="w-full  shadow-lg rounded-md">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
