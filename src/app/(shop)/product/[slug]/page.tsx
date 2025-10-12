import { getProductBySlug } from "@/app/actions/products";
import ProductDetails from "@/components/product details/ProductDetails";
import { ProductSchemas } from "@/components/SEO/SiteSchemas";
import { usdToToman } from "@/lib/exchange";
import { getProductMetadata } from "@/lib/metadata/productMetadata";

export async function generateMetadata({ params }: any) {
  return getProductMetadata(params.slug);
}

export default async function ProductPage({ params }: any) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  const standardizedProduct = {
    ...product,
    price: product.price.toNumber(),
    priceToman: await usdToToman(product.price.toNumber()),
    oldPrice: product.oldPrice ? product.oldPrice.toNumber() : null,
    oldPriceToman: product.oldPrice
      ? await usdToToman(product.oldPrice.toNumber())
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
