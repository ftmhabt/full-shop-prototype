"use client";

export default function BlogSchemas({ posts }: { posts: any[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // ✅ Breadcrumb schema
  const breadcrumbSchema = {
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
    ],
  };

  // ✅ Blog listing schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "مقالات سیستم‌های حفاظتی",
    description:
      "مطالب آموزشی و تحلیلی درباره سیستم‌های حفاظتی، دزدگیر، دوربین مداربسته و تجهیزات امنیتی.",
    url: `${siteUrl}/blog`,
    blogPost: posts.slice(0, 10).map((post, i) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.createdAt,
      author: {
        "@type": "Person",
        name: post.author?.displayName || "نویسنده",
      },
      position: i + 1,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  );
}
