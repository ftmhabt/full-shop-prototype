import FiltersForm from "@/components/FiltersForm";

interface FiltersFormWrapperProps {
  slug: string;
  filters: Record<string, string[]>;
  attributes: any[];
  brands?: { id: string; name: string; slug: string }[];
  query?: string;
}

export default async function FiltersFormWrapper({
  slug,
  filters,
  attributes,
  brands,
  query,
}: FiltersFormWrapperProps) {
  return (
    <FiltersForm
      slug={slug}
      filters={filters}
      attributes={attributes}
      query={query}
      brands={brands}
    />
  );
}
