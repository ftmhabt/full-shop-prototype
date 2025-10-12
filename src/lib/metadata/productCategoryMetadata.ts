import { Metadata } from "next";
import db from "../db";

const categoryCache = new Map<string, Metadata>(); // simple in-memory cache

export async function getProductCategoryMetadata(
  slug: string
): Promise<Metadata> {
  if (categoryCache.has(slug)) return categoryCache.get(slug)!;

  const category = await db.category.findUnique({ where: { slug } });

  const meta: Metadata = category
    ? {
        title: `${category.name} | فروشگاه سیستم‌های حفاظتی`,
        description: `خرید آنلاین محصولات ${category.name} با بهترین قیمت و گارانتی اصلی.`,
        keywords: category.name.split(" "), // simple SEO keywords
        robots: { index: true, follow: true },
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${category.slug}`,
        },
        openGraph: {
          title: `${category.name} | فروشگاه سیستم‌های حفاظتی`,
          description: `محصولات ${category.name} شامل دزدگیر، دوربین مدار بسته و تجهیزات امنیتی.`,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${category.slug}`,
          siteName: "فروشگاه سیستم‌های حفاظتی",
          locale: "fa_IR",
          type: "website",
        },
      }
    : {
        title: "دسته‌بندی یافت نشد | فروشگاه سیستم‌های حفاظتی",
        description: "این دسته‌بندی در فروشگاه سیستم‌های حفاظتی موجود نیست.",
        robots: { index: false, follow: false },
      };

  if (category) categoryCache.set(slug, meta); // cache result
  return meta;
}
