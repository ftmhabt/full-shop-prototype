import { getProductsByCategorySlug } from "@/app/actions/products";
import { getRateCached } from "@/lib/exchangeCache";
import { getLatestRate } from "@/lib/latestRate";
import InfiniteProducts from "../product/InfiniteProducts";

interface ProductsWrapperProps {
  slug?: string;
  filters?: Record<string, string[]>;
  orderBy?: string;
  query?: string;
  take?: number;
}

export default async function ProductsWrapper({
  slug,
  filters = {},
  orderBy = "newest",
  take = 12,
}: ProductsWrapperProps) {
  if (!slug) return null;

  // make sure orderBy in filters if you want the action to read it consistently
  if (orderBy) filters.orderBy = [orderBy];

  const data = await getProductsByCategorySlug(slug, filters, take);

  if (!data?.length) return <p>هیچ محصولی یافت نشد</p>;

  const rate = await getRateCached(getLatestRate);

  const standardized = await Promise.all(
    data.map(async (p) => ({
      ...p,
      price: (p.price as any).toNumber
        ? (p.price as any).toNumber()
        : Number(p.price),
      oldPrice: p.oldPrice
        ? (p.oldPrice as any).toNumber?.() ?? Number(p.oldPrice)
        : null,
      priceToman: Math.round(
        ((p.price as any).toNumber
          ? (p.price as any).toNumber()
          : Number(p.price)) * rate
      ),
      oldPriceToman: p.oldPrice
        ? Math.round(
            ((p.oldPrice as any).toNumber
              ? (p.oldPrice as any).toNumber()
              : Number(p.oldPrice)) * rate
          )
        : null,
      reviews: p.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: (r as any).content ?? null,
        user: { displayName: r.user?.displayName ?? "" },
      })),
    }))
  );

  return (
    <InfiniteProducts initialProducts={standardized} slug={slug} take={take} />
  );
}
