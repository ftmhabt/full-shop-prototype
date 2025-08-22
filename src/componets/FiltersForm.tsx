"use client";

import { useRouter } from "next/navigation";

interface FiltersFormProps {
  slug: string;
  attributes: {
    id: string;
    name: string;
    values: { id: string; value: string }[];
  }[];
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function FiltersForm({
  slug,
  attributes,
  searchParams,
}: FiltersFormProps) {
  const router = useRouter();

  // Normalize URL params for defaultChecked
  const filters: Record<string, string[]> = {};
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (!value) return;
    filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  const applyFilters = (formData: FormData) => {
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, String(value));
    }
    // Navigate → server-side fetch
    router.push(`/category/${slug}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      {/* In Stock checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="inStock"
          value="true"
          defaultChecked={filters.inStock?.includes("true")}
        />
        <span>فقط موجودی</span>
      </label>

      {/* Attribute filters */}
      {attributes.map((attr) => (
        <div key={attr.id} className="border p-2 rounded">
          <h3 className="font-bold mb-2">{attr.name}</h3>
          {attr.values.map((val) => (
            <label key={val.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={attr.id}
                value={val.id}
                defaultChecked={filters[attr.id]?.includes(val.id)}
              />
              <span>{val.value}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        اعمال فیلتر
      </button>
    </form>
  );
}
