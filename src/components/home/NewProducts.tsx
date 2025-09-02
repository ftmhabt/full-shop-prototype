import { ProductWithAttributes } from "@/types";
import ProductCard from "./ProductCard";

export default async function NewProducts({
  products,
}: {
  products: ProductWithAttributes[];
}) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">جدیدترین محصولات</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
