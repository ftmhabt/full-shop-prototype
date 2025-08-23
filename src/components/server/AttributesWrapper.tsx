import { getAttributesByCategorySlug } from "@/app/actions/products";
import FiltersForm from "@/componets/FiltersForm";

interface AttributesWrapperProps {
  slug: string; // slug دسته‌بندی یا "search"
  searchParams?: Record<string, string | string[] | undefined>; // پارامترهای URL برای فیلترها و query
}
export default async function AttributesWrapper({
  slug,
  searchParams = {},
}: AttributesWrapperProps) {
  const attributes = await getAttributesByCategorySlug(slug);

  // تبدیل searchParams به filters و query
  const filters: Record<string, string[]> = {};
  let query: string | undefined;

  for (const key in searchParams) {
    const value = searchParams[key];
    if (!value) continue;

    if (key === "q") {
      query = value as string;
    } else {
      filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
    }
  }

  return (
    <FiltersForm
      slug={slug}
      attributes={attributes}
      filters={filters}
      query={query}
    />
  );
}
