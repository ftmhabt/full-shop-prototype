"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface FiltersFormProps {
  slug: string;
  filters?: Record<string, string[]>;
  attributes?: {
    id: string;
    name: string;
    values: { id: string; value: string }[];
  }[];
}

export default function FiltersForm({
  slug,
  filters = {},
  attributes = [],
}: FiltersFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function applyFilters(formData: FormData) {
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, String(value));
    }

    startTransition(() => {
      router.push(`/category/${slug}?${params.toString()}`);
    });
  }

  return (
    <form action={applyFilters} className="space-y-4">
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
                name={attr.id}
                value={val.id}
                defaultChecked={filters[attr.id]?.includes(val.id) ?? false}
              />
              <span>{val.value}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded w-full flex items-center justify-center"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "اعمال فیلتر"
        )}
      </button>
    </form>
  );
}
