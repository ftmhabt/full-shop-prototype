import { getAttributesByCategorySlug } from "@/app/actions/products";
import FiltersFormWrapper from "@/components/FiltersFormWrapper";
import ProductsSkeleton from "@/components/loading/ProductSkeleton";
import ProductsWrapper from "@/components/server/ProductsWrapper";
import SortBar from "@/components/SortBar";
import db from "@/lib/db";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return {
      title: "دسته‌بندی یافت نشد | فروشگاه سیستم‌های حفاظتی",
      description: "این دسته‌بندی در فروشگاه سیستم‌های حفاظتی موجود نیست.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${category.name} | فروشگاه سیستم‌های حفاظتی`,
    description: `خرید آنلاین محصولات ${category.name} با بهترین قیمت و گارانتی اصلی.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | فروشگاه سیستم‌های حفاظتی`,
      description: `محصولات ${category.name} شامل دزدگیر، دوربین مدار بسته و تجهیزات امنیتی.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${category.slug}`,
      siteName: "فروشگاه سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "website",
    },
  };
}

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
