import db from "@/lib/db";
import { Metadata } from "next";

export async function getBlogCategoryMetadata(slug: string): Promise<Metadata> {
  const category = await db.blogCategory.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "دسته‌بندی یافت نشد | مقالات سیستم‌های حفاظتی",
      description:
        "این دسته‌بندی در مقالات فروشگاه سیستم‌های حفاظتی موجود نیست.",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: `${category.name} | مقالات سیستم‌های حفاظتی`,
    description:
      category.description || `مطالب آموزشی و مقالات ${category.name}.`,
    alternates: {
      canonical: `${siteUrl}/blog/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | مقالات سیستم‌های حفاظتی`,
      description:
        category.description || `مطالب آموزشی و مقالات ${category.name}.`,
      url: `${siteUrl}/blog/${category.slug}`,
      siteName: "مقالات سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "website",
    },
  };
}
