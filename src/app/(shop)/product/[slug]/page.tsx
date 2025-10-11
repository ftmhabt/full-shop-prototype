import { getProductBySlug } from "@/app/actions/products";
import BreadcrumbJSONLD from "@/components/BreadcrumbJSONLD";
import ProductDetails from "@/components/product details/ProductDetails";
import { usdToToman } from "@/lib/exchange";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug); // تابعی که جزئیات محصول را می‌آورد

  if (!product) {
    return {
      title: "محصول یافت نشد | فروشگاه سیستم‌های حفاظتی",
      description: "محصول مورد نظر در فروشگاه سیستم‌های حفاظتی موجود نیست.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} | خرید ${product.name} با بهترین قیمت`,
    description: `خرید ${product.name}، ${
      product.category.name || "سیستم حفاظتی"
    } با گارانتی اصلی و ارسال سریع از فروشگاه سیستم‌های حفاظتی.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | فروشگاه سیستم‌های حفاظتی`,
      description: `فروش ${product.name}، شامل مشخصات، قیمت و تصاویر با گارانتی معتبر.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      siteName: "فروشگاه سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "website",
      images: product.image[0] ? [product.image[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: any) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  const standardizedProducts = {
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
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.description,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: product.brand?.name || "برند نامشخص",
            },
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
              priceCurrency: "IRR", // تومان = ریال در استاندارد Schema.org
              price: standardizedProducts.priceToman || product.price,
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              priceValidUntil: "2025-12-31",
              seller: {
                "@type": "Organization",
                name: "فروشگاه سیستم‌های حفاظتی",
                url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost",
              },
            },
            aggregateRating: product.reviews?.length
              ? {
                  "@type": "AggregateRating",
                  ratingValue: (
                    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    product.reviews.length
                  ).toFixed(1),
                  reviewCount: product.reviews.length,
                }
              : undefined,
            review:
              product.reviews?.length > 0
                ? product.reviews.map((r) => ({
                    "@type": "Review",
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: r.rating,
                      bestRating: "5",
                    },
                    author: {
                      "@type": "Person",
                      name: r.user.displayName || "کاربر",
                    },
                    reviewBody: r.content || "",
                  }))
                : undefined,
          }),
        }}
      />
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbJSONLD
        items={[
          { name: "خانه", url: process.env.NEXT_PUBLIC_SITE_URL as string },
          {
            name: product.category.name,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${product.category.slug}`,
          },
          {
            name: product.name,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
          },
        ]}
      />
      <ProductDetails product={standardizedProducts} />
    </>
  );
}
