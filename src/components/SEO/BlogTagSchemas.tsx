"use client";

import JsonLd from "./JsonLd";

export default function BlogTagSchemas({ tag }: { tag: any }) {
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
        name: `برچسب: ${tag.name}`,
        item: `${siteUrl}/blog/tag/${tag.slug}`,
      },
    ],
  };

  const blogTag = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `برچسب: ${tag.name}`,
    description:
      tag.description ||
      `مطالب مرتبط با برچسب ${tag.name} در سیستم‌های حفاظتی.`,
    url: `${siteUrl}/blog/tag/${tag.slug}`,
    mainEntity: tag.posts.map((post: any) => ({
      "@type": "BlogPosting",
      headline: post.title,
      author: {
        "@type": "Person",
        name: post.author.displayName || "ناشناس",
      },
      datePublished: post.createdAt,
      url: `${siteUrl}/blog/${post.category?.slug}/${post.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={blogTag} />
    </>
  );
}
