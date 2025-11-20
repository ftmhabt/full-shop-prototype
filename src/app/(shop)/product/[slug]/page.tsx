import { getProductBySlug } from "@/app/actions/products";
import ProductDetails from "@/components/product details/ProductDetails";
import { ProductSchemas } from "@/components/SEO/SiteSchemas";
import { getRateCached } from "@/lib/exchangeCache";
import { getLatestRate } from "@/lib/latestRate";
import { getProductMetadata } from "@/lib/metadata/productMetadata";

export async function generateMetadata({ params }: any) {
  return getProductMetadata(params.slug);
}

export default async function ProductPage({ params }: any) {
  const rate = await getRateCached(getLatestRate);

  const { slug } = params;
  const product = await getProductBySlug(slug);
  const standardizedProduct = {
    ...product,
    price: product.price.toNumber(),
    priceToman: Math.round(product.price.toNumber() * rate),
    oldPrice: product.oldPrice ? product.oldPrice.toNumber() : null,
    oldPriceToman: product.oldPrice
      ? Math.round(product.oldPrice.toNumber() * rate)
      : null,
    reviews: product.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.content ?? null,
      user: { displayName: r.user.displayName ?? "" },
    })),
  };

  return (
    <>
      <ProductSchemas product={standardizedProduct} />
      <ProductDetails product={standardizedProduct} />
    </>
  );
}
