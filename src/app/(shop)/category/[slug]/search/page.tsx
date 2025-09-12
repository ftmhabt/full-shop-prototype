import { getAttributesByCategorySlug } from "@/app/actions/products";
import FiltersForm from "@/components/FiltersForm";
import ProductsSkeleton from "@/components/loading/ProductSkeleton";
import ProductsWrapper from "@/components/server/ProductsWrapper";
import SortBar from "@/components/SortBar";
import { Suspense } from "react";

export default async function CategorySearchPage({
  params,
  searchParams,
}: any) {
  const { slug } = params;
  const resolvedSearchParams = searchParams;

  const filters: Record<string, string[]> = {};
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (!value) return;
    filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  const orderBy = resolvedSearchParams.orderBy as string | undefined;
  const query = resolvedSearchParams.q as string | undefined;

  const attributes = await getAttributesByCategorySlug(slug);

  const categories = [
    {
      id: 1,
      label: "دزدگیر اماکن",
      slug: "alarm-systems",
    },
    {
      id: 2,
      label: "دوربین مداربسته",
      slug: "cctv-cameras",
    },
    {
      id: 3,
      label: "لوازم جانبی",
      slug: "accessories",
    },
    {
      id: 4,
      label: "کنترل تردد",
      slug: "access-control",
    },
    {
      id: 5,
      label: "هوشمندسازی",
      slug: "smart-home",
    },
  ];

  const currentCategory = categories.find((cat) => cat.slug === slug);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:p-6 w-full">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-4">
        <FiltersForm
          slug={slug}
          query={query}
          filters={filters}
          attributes={attributes}
        />
      </aside>

      {/* Main */}
      <main className="lg:col-span-3 space-y-4">
        <div className="flex flex-col-reverse sm:flex-row  items-center justify-between gap-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-bold block">
            نتایج برای &quot;{query}&quot; در دسته{" "}
            {currentCategory ? currentCategory.label : slug}
          </h1>
          <SortBar />
        </div>
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsWrapper
            slug={slug}
            filters={filters}
            orderBy={orderBy}
            query={query}
          />
        </Suspense>
      </main>
    </div>
  );
}
