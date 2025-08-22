import { getProductsByCategorySlug } from "@/app/actions/products";

interface ProductsWrapperProps {
  slug: string;
  filters: Record<string, string[]>;
}

export default async function ProductsWrapper({
  slug,
  filters,
}: ProductsWrapperProps) {
  const products = await getProductsByCategorySlug(slug, filters);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">محصولات</h1>
      {products.length === 0 ? (
        <p>محصولی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border rounded p-4">
              <h2 className="font-semibold">{p.name}</h2>
              <p>{new Intl.NumberFormat("fa-IR").format(p.price)} تومان</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
