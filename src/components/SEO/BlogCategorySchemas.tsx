"use client";

import JsonLd from "./JsonLd";

export default function BlogCategorySchemas({ category }: { category: any }) {
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
        name: "مقالات",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${siteUrl}/blog/${category.slug}`,
      },
    ],
  };

  const blogCategorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `دسته‌بندی: ${category.name}`,
    description:
      category.description || `مطالب آموزشی مرتبط با ${category.name}`,
    url: `${siteUrl}/blog/${category.slug}`,
    mainEntity: category.posts.map((post: any) => ({
      "@type": "BlogPosting",
      headline: post.title,
      author: {
        "@type": "Person",
        name: post.author.displayName || "ناشناس",
      },
      datePublished: post.createdAt,
      url: `${siteUrl}/blog/${category.slug}/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={blogCategorySchema} />
    </>
  );
}
