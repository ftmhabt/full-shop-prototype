import { getProductBySlug } from "@/app/actions/products";
import ProductDetails from "@/components/product details/ProductDetails";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  return {
    title: `${product.name} | My Shop`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image.map((url) => ({ url })),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.image,
    },
  };
}

export default async function ProductPage({ params }: any) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.description,
            sku: product.id,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
      <ProductDetails product={product} />
    </>
  );
}
