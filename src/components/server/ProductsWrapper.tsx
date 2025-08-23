import { getProductsByCategorySlug } from "@/app/actions/products";
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

  // اگر products پاس داده نشده، با slug بگیریم
  if (!finalProducts.length) {
    if (!slug) {
      throw new Error("Either products or slug must be provided");
    }

    const queryFilters: Record<string, any> = { ...filters };
    if (orderBy) queryFilters.orderBy = [orderBy];

    finalProducts = await getProductsByCategorySlug(slug, queryFilters);
  }

  if (!finalProducts.length) {
    return <p>محصولی یافت نشد.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {finalProducts.map((p) => (
        <div key={p.id} className="border rounded p-4">
          <h2 className="font-semibold">{p.name}</h2>
          <p>{new Intl.NumberFormat("fa-IR").format(p.price)} تومان</p>
          <p className="text-sm text-gray-500">
            {p.attributes
              ?.map((a) => `${a.value.attribute.name}: ${a.value.value}`)
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
