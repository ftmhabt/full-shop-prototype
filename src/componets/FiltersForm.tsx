"use client";
import { AttributeWithValues } from "@/types";
import { Record } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface FiltersFormProps {
  slug?: string; // category slug یا "search"
  query?: string; // جستجو
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

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();

    if (query) params.append("q", query);

    for (const [key, value] of formData.entries()) {
      params.append(key, String(value));
    }

    startTransition(() => {
      if (!slug || slug === "search") {
        router.push(`/search?${params.toString()}`);
      } else {
        router.push(`/category/${slug}?${params.toString()}`);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="inStock"
          value="true"
          defaultChecked={filters["inStock"]?.includes("true") ?? false}
        />
        <span>فقط موجودی</span>
      </label>

      {attributes.map((attr) => (
        <div key={attr.id} className="border p-2 rounded">
          <h3 className="font-bold mb-2">{attr.name}</h3>
          {attr.values.map((val) => (
            <label key={val.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={attr.slug}
                value={val.slug}
                defaultChecked={filters[attr.slug]?.includes(val.slug) ?? false}
              />
              <span>{val.value}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-white px-4 py-2 rounded w-full flex items-center justify-center"
      >
        {isPending ? "در حال بارگذاری..." : "اعمال فیلتر"}
      </button>
    </form>
  );
}
