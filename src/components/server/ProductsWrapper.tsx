import { getProductsByCategorySlug } from "@/app/actions/products";
import ProductCard from "@/componets/ProductCard";
import { ProductWithAttributes } from "@/types";

interface ProductsWrapperProps {
  slug?: string;
  filters?: Record<string, string[]>;
  orderBy?: string;
  products?: ProductWithAttributes[];
}

export default async function ProductsWrapper({
  slug,
  filters = {},
  orderBy,
  products,
}: ProductsWrapperProps) {
  let finalProducts: ProductWithAttributes[] = products ?? [];

  if (!finalProducts.length) {
    if (!slug) return <p className="text-gray-500">هیچ محصولی یافت نشد.</p>;
    const queryFilters: Record<string, string[]> = { ...filters };
    if (orderBy) queryFilters.orderBy = [orderBy];
    finalProducts = await getProductsByCategorySlug(slug, queryFilters);
  }

  if (!finalProducts.length) return <p>محصولی یافت نشد.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {finalProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
