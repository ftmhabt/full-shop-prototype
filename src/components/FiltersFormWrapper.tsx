"use client";

import FiltersForm from "@/components/FiltersForm";

interface FiltersFormWrapperProps {
  slug: string;
  filters: Record<string, string[]>;
  attributes: any[];
  query?: string;
}

export default function FiltersFormWrapper({
  slug,
  filters,
  attributes,
  query,
}: FiltersFormWrapperProps) {
  return (
    <FiltersForm
      slug={slug}
      filters={filters}
      attributes={attributes}
      query={query}
    />
  );
}
