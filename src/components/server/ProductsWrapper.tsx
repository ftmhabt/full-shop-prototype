// app/category/[slug]/ProductsWrapper.tsx
import { getProductsByCategorySlug } from "@/app/actions/products";

export default async function ProductsWrapper({
  slug,
  filters,
  orderBy,
}: {
  slug: string;
  filters: Record<string, string[]>;
  orderBy?: string;
}) {
  // add `orderBy` to filters before sending to DB
  const queryFilters = { ...filters };
  if (orderBy) queryFilters.orderBy = [orderBy];

  const products = await getProductsByCategorySlug(slug, queryFilters);

  if (!products || products.length === 0) {
    return <p>محصولی یافت نشد.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="border rounded p-4">
          <h2 className="font-semibold">{p.name}</h2>
          <p>
            {new Intl.NumberFormat("fa-IR").format(
              p.price as unknown as number
            )}{" "}
            تومان
          </p>
          <p className="text-sm text-gray-500">
            {p.attributes
              .map((a) => `${a.value.attribute.name}: ${a.value.value}`)
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
