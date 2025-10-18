"use client";

interface BlogPostSchemasProps {
  post: {
    title: string;
    excerpt?: string | null;
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    slug: string;
    author: { displayName?: string | null };
    category?: { name: string; slug: string } | null;
  };
}

export default function BlogPostSchemas({ post }: BlogPostSchemasProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL as string;
  const url = `${siteUrl}/blog/${post.category?.slug || ""}/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 150),
    author: {
      "@type": "Person",
      name: post.author.displayName || "نویسنده ناشناس",
    },
    publisher: {
      "@type": "Organization",
      name: "وبلاگ سیستم‌های حفاظتی",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
  };

  const breadcrumbsJsonLd = {
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
        name: "مقالات",
        item: `${siteUrl}/blog`,
      },
      ...(post.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.category.name,
              item: `${siteUrl}/blog/${post.category.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
    </>
  );
}
