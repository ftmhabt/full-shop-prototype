import { getRateCached } from "./exchangeCache";
import { getLatestRate } from "./latestRate";

export async function standardizeProduct(product: any) {
  const rate = await getRateCached(getLatestRate);

  return {
    ...product,
    price: product.price?.toNumber?.() ?? product.price ?? 0,
    priceToman: Math.round(
      (product.price?.toNumber?.() ?? product.price ?? 0) * rate
    ),
    oldPrice: product.oldPrice ? product.oldPrice.toNumber() : null,
    oldPriceToman: product.oldPrice
      ? Math.round((product.oldPrice.toNumber() ?? product.oldPrice) * rate)
      : null,
    reviews: Array.isArray(product.reviews)
      ? product.reviews.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.content ?? null,
          user: { displayName: r.user?.displayName ?? "" },
        }))
      : [],
  };
}

export async function standardizeProducts(products: any[]) {
  return Promise.all(products.map((p) => standardizeProduct(p)));
}
