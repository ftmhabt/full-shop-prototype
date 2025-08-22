import AttributesWrapper from "@/components/server/AttributesWrapper";
import ProductsWrapper from "@/components/server/ProductsWrapper";
import { Suspense } from "react";

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const slug = params.slug;

  // Normalize searchParams to string[]
  const filters: Record<string, string[]> = {};
  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (!value) return;
    filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Sidebar */}
      <aside className="space-y-4">
        <Suspense fallback={<p>در حال بارگذاری فیلترها…</p>}>
          {/* Server component fetches attributes */}
          <AttributesWrapper slug={slug} searchParams={searchParams} />
        </Suspense>
      </aside>

      {/* Main content */}
      <main className="col-span-3">
        <Suspense fallback={<p>در حال بارگذاری محصولات…</p>}>
          <ProductsWrapper slug={slug} filters={filters} />
        </Suspense>
      </main>
    </div>
  );
}
