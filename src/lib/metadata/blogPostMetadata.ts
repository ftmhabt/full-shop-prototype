import db from "@/lib/db";
import { Metadata } from "next";

export async function getBlogPostMetadata(
  catSlug: string,
  slug: string
): Promise<Metadata> {
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { displayName: true } },
      category: true,
      tags: true,
    },
  });

  if (!post) {
    return {
      title: "مقاله یافت نشد | مقالات سیستم‌های حفاظتی",
      description: "این مقاله در وبلاگ سیستم‌های حفاظتی موجود نیست.",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${catSlug}/${slug}`;
  const desc =
    post.excerpt ||
    "مطالب و آموزش‌های تخصصی در زمینه دوربین مداربسته، دزدگیر و سیستم‌های امنیتی.";

  return {
    title: `${post.title} | مقالات سیستم‌های حفاظتی`,
    description: desc,
    alternates: { canonical },
    authors: [{ name: post.author.displayName || "نویسنده ناشناس" }],
    openGraph: {
      title: post.title,
      description: desc,
      url: canonical,
      siteName: "مقالات سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "article",
      // images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}
