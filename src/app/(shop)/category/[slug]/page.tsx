import { getAttributesByCategorySlug } from "@/app/actions/products";
import FiltersFormWrapper from "@/components/FiltersFormWrapper";
import ProductsSkeleton from "@/components/loading/ProductSkeleton";
import ProductsWrapper from "@/components/server/ProductsWrapper";
import SortBar from "@/components/SortBar";
import { Suspense } from "react";

export default async function CategoryPage({ params, searchParams }: any) {
  const { slug } = params;
  const resolvedSearchParams = searchParams;

  const filters: Record<string, string[]> = {};
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (!value) return;
    filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  const orderBy = resolvedSearchParams.orderBy as string | undefined;
  const attributes = await getAttributesByCategorySlug(slug);
  const query = resolvedSearchParams.q as string | undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:p-6 w-full">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-4">
        <FiltersFormWrapper
          slug={slug}
          filters={filters}
          attributes={attributes}
          query={query}
        />
      </aside>

      {/* Main */}
      <main className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between gap-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-bold block">محصولات</h1>
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
