import { getProductsByCategorySlug } from "@/app/actions/products";
import { getProductsBySearch } from "@/app/actions/search";
import type { ProductWithAttributes } from "@/types";
import ProductCard from "../home/ProductCard";

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
  const standardizedProducts = data.map((p) => ({
    ...p,
    price: p.price.toNumber(),
    oldPrice: p.oldPrice ? p.oldPrice.toNumber() : null,
    reviews: p.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.content ?? null,
      user: { displayName: r.user.displayName ?? "" },
    })),
  }));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {standardizedProducts?.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
