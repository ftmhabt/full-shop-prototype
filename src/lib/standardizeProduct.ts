import { usdToToman } from "./exchange";

export async function standardizeProduct(product: any) {
  return {
    ...product,
    price: product.price?.toNumber?.() ?? product.price ?? 0,
    priceToman: await usdToToman(
      product.price?.toNumber?.() ?? product.price ?? 0
    ),
    oldPrice: product.oldPrice ? product.oldPrice.toNumber() : null,
    oldPriceToman: product.oldPrice
      ? await usdToToman(product.oldPrice.toNumber())
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
