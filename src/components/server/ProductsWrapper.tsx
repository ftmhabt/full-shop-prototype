import { getProductsByCategorySlug } from "@/app/actions/products";
import { getProductsBySearch } from "@/app/actions/search";
import ProductCard from "@/componets/ProductCard";
import type { ProductWithAttributes } from "@/types";

interface ProductsWrapperProps {
  slug?: string;
  filters?: Record<string, string[]>;
  orderBy?: string;
  query?: string;
}

export default async function ProductsWrapper({
  slug,
  filters = {},
  orderBy = "newest",
  query,
}: ProductsWrapperProps) {
  let data: ProductWithAttributes[] = [];

  if (query && slug) {
    // سرچ داخل یک کتگوری
    const res = await getProductsBySearch(query, filters, orderBy, slug);

    data = res.products;
  } else if (slug) {
    // نمایش محصولات دسته‌بندی
    data = await getProductsByCategorySlug(slug, filters);
  }

  if (!data.length) return <p>هیچ محصولی یافت نشد</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
