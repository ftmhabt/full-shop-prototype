import { get4PopularProducts } from "@/lib/homeData";
import ProductSlider from "./ProductSlider";

export default async function HotProducts() {
  const products = await get4PopularProducts();
  return (
    <section className="mt-10 relative">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">داغ‌ترین‌های هفته گذشته</h2>
      </div>

      <ProductSlider products={products} />
    </section>
  );
}
