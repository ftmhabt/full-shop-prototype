"use client";

import { getRelatedProducts } from "@/app/actions/products";
import { standardizeProducts } from "@/lib/standardizeProduct";
import { useEffect, useState } from "react";
import ProductSlider from "../home/ProductSlider";
import ProductSliderSkeleton from "./ProductSliderSkeleton";

export default function RelatedProducts({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true);
        const products = await getRelatedProducts(categorySlug, 8);
        const standardized = await standardizeProducts(products);
        setRelated(standardized);
      } catch {
        setRelated([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRelated();
  }, [categorySlug]);

  return (
    <div className="relative h-[420px] px-12 transition-all duration-300">
      {loading ? (
        <div className="absolute inset-0 opacity-100 transition-opacity duration-300">
          <ProductSliderSkeleton />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-100 transition-opacity duration-300">
          <ProductSlider products={related} />
        </div>
      )}
    </div>
  );
}
