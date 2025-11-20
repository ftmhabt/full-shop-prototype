import {
  getAttributesByCategorySlug,
  getProductsByCategorySlug,
} from "@/app/actions/products";
import FiltersFormWrapper from "@/components/FiltersFormWrapper";
import ProductsSkeleton from "@/components/loading/ProductSkeleton";
import CategorySchemas from "@/components/SEO/CategorySchemas";
import ProductsWrapper from "@/components/server/ProductsWrapper";
import SortBar from "@/components/SortBar";
import db from "@/lib/db";
import { getRateCached } from "@/lib/exchangeCache";
import { getLatestRate } from "@/lib/latestRate";
import { getProductCategoryMetadata } from "@/lib/metadata/productCategoryMetadata";
import { ProductWithAttributes } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({ params }: any) {
  return getProductCategoryMetadata(params.slug);
}

export default async function CategoryPage({ params, searchParams }: any) {
  const { slug } = params;
  const resolvedSearchParams = searchParams;
  const category = await db.category.findUnique({ where: { slug } });

  if (!category) return notFound();

  // Handle filters and sorting
  const { filters, orderBy, query } =
    parseCategorySearchParams(resolvedSearchParams);
  const attributes = await getAttributesByCategorySlug(slug);

  const productsPerPage = 12;
  const totalProducts = await db.product.count({
    where: { categoryId: category.id },
  });
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentPage = Number(resolvedSearchParams.page) || 1;

  // For schema only
  const rawProducts = await getProductsByCategorySlug(
    slug,
    filters,
    productsPerPage,
    undefined,
    currentPage
  );
  const standardizedProducts = await standardizeProducts(rawProducts);

  return (
    <>
      {/* SEO Schemas for Google */}
      <CategorySchemas category={category} products={standardizedProducts} />

      {/* Invisible SEO pagination */}
      {currentPage > 1 && (
        <link rel="prev" href={`/category/${slug}?page=${currentPage - 1}`} />
      )}
      {currentPage < totalPages && (
        <link rel="next" href={`/category/${slug}?page=${currentPage + 1}`} />
      )}

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
            <h1 className="text-xl sm:text-2xl font-bold block">
              محصولات {category.name}
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
    </>
  );
}

function parseCategorySearchParams(
  searchParams: Record<string, string | string[] | undefined>
) {
  const filters: Record<string, string[]> = {};
  let orderBy: string | undefined;
  let query: string | undefined;

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (!value) return;
    if (key === "orderBy") orderBy = Array.isArray(value) ? value[0] : value;
    else if (key === "query") query = Array.isArray(value) ? value[0] : value;
    else filters[key] = Array.isArray(value) ? value.filter(Boolean) : [value];
  });

  return { filters, orderBy, query };
}

async function standardizeProducts(products: ProductWithAttributes[]) {
  const rate = await getRateCached(getLatestRate);

  return Promise.all(
    products.map(async (p) => ({
      ...p,
      price: p.price.toNumber(),
      priceToman: Math.round(p.price.toNumber() * rate),
      oldPrice: p.oldPrice?.toNumber() || null,
      oldPriceToman: p.oldPrice
        ? Math.round(p.oldPrice.toNumber() * rate)
        : null,
      image: Array.isArray(p.image) ? p.image : [p.image],
    }))
  );
}
