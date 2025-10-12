"use client";

import { StandardizedProduct } from "@/types";
import JsonLd from "./JsonLd";

export function SiteSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "فروشگاه سیستم‌های حفاظتی",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    // sameAs: [
    //   "https://instagram.com/yourpage",
    //   "https://t.me/yourpage",
    //   "https://www.aparat.com/yourpage",
    // ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "فروشگاه سیستم‌های حفاظتی",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: siteUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <JsonLd data={breadcrumbs} />
    </>
  );
}

export function ProductSchemas({ product }: { product: StandardizedProduct }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `${siteUrl}/category/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/product/${product.slug}`,
      },
    ],
  };

  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: Array.isArray(product.image)
      ? product.image.map((img) => `${siteUrl}${img}`)
      : [`${siteUrl}${product.image}`],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "برند نامشخص",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      price: String(product.priceToman),
      priceCurrency: "IRT",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: "2025-12-31",
      seller: {
        "@type": "Organization",
        name: "فروشگاه سیستم‌های حفاظتی",
        url: siteUrl,
      },
    },
  };

  const hasReviews = product.reviews && product.reviews.length > 0;
  if (hasReviews) {
    const avg =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length;

    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: product.reviews.length,
    };
  }

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={productSchema} />
    </>
  );
}
