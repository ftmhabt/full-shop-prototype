"use client";

import { StandardizedProduct } from "@/types";
import "swiper/css";
import ProductSlider from "./ProductSlider";

interface HotProductsProps {
  products: StandardizedProduct[];
}

export default function HotProducts({ products }: HotProductsProps) {
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
