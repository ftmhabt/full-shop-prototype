import { getAttributesByCategorySlug } from "@/app/actions/products";
import { ProductsSkeleton } from "@/components/loading/ProductSkeleton";
import { Spinner } from "@/components/loading/Spinner";
import ProductsWrapper from "@/components/server/ProductsWrapper";
import FiltersForm from "@/componets/FiltersForm";
import SortBar from "@/componets/SortBar";
import { Suspense } from "react";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const filters: Record<string, string[]> = {};
  Object.entries(resolvedSearchParams || {}).forEach(([key, value]) => {
    if (!value) return;
    filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  const orderBy = resolvedSearchParams.orderBy as string | undefined;
  const attributes = await getAttributesByCategorySlug(slug);

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Sidebar */}
      <aside className="space-y-4">
        <Suspense fallback={<Spinner />}>
          <FiltersForm slug={slug} filters={filters} attributes={attributes} />
        </Suspense>
      </aside>

      {/* Main */}
      <main className="col-span-3 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">محصولات</h1>
          <SortBar />
        </div>
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsWrapper slug={slug} filters={filters} orderBy={orderBy} />
        </Suspense>
      </main>
    </div>
  );
}
