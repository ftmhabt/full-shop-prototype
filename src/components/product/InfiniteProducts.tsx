"use client";

import ProductCard from "@/components/home/ProductCard";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

type Prod = any;

interface Props {
  initialProducts?: Prod[];
  slug: string;
  take?: number;
}

export default function InfiniteProducts({
  initialProducts = [],
  slug,
  take = 12,
}: Props) {
  const [products, setProducts] = useState<Prod[]>(initialProducts);
  const [cursor, setCursor] = useState<string | null>(
    initialProducts.at(-1)?.id ?? null
  );
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  // Reset local state when filters/sort/query change (page re-render from server should also supply new initialProducts)
  useEffect(() => {
    setProducts(initialProducts);
    setCursor(initialProducts.at(-1)?.id ?? null);
    setHasMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, searchParams?.toString()]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && hasMore && !isPending) loadMore();
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef.current, hasMore, isPending, cursor]);

  async function loadMore() {
    if (!cursor) {
      setHasMore(false);
      return;
    }

    startTransition(async () => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("slug", slug);
      params.set("cursor", cursor);
      params.set("take", String(take));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const next: Prod[] = await res.json();
      if (!next?.length) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...next]);
      setCursor(next.at(-1)?.id ?? null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {hasMore ? (
        <div ref={loaderRef} className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-muted-foreground">
          همه محصولات نمایش داده شدند
        </div>
      )}
    </div>
  );
}
