"use client";

import JsonLd from "./JsonLd";

interface CategorySchemasProps {
  category: { name: string; slug: string };
  products: {
    name: string;
    slug: string;
    image: string[];
    priceToman: number;
  }[];
}

export default function CategorySchemas({
  category,
  products,
}: CategorySchemasProps) {
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
        name: category.name,
        item: `${siteUrl}/category/${category.slug}`,
      },
    ],
  };

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} | فروشگاه سیستم‌های حفاظتی`,
    description: `لیست محصولات ${category.name} با بهترین قیمت و گارانتی اصلی.`,
    url: `${siteUrl}/category/${category.slug}`,
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `محصولات ${category.name}`,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${siteUrl}/product/${product.slug}`,
        image: Array.isArray(product.image)
          ? `${siteUrl}${product.image[0]}`
          : `${siteUrl}${product.image}`,
        offers: {
          "@type": "Offer",
          price: product.priceToman.toString(),
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collectionPage} />
      <JsonLd data={itemList} />
    </>
  );
}
