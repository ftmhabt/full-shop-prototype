import db from "@/lib/db";
import { Metadata } from "next";

export async function getBlogTagMetadata(slug: string): Promise<Metadata> {
  const tag = await db.blogTag.findUnique({
    where: { slug },
  });

  if (!tag) {
    return {
      title: "برچسب یافت نشد | مقالات سیستم‌های حفاظتی",
      description: "این برچسب در مقالات فروشگاه سیستم‌های حفاظتی موجود نیست.",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: `${tag.name} | مقالات سیستم‌های حفاظتی`,
    description: `مطالب و مقالات مرتبط با برچسب ${tag.name} در زمینه دزدگیر، دوربین مداربسته و تجهیزات امنیتی.`,
    alternates: {
      canonical: `${siteUrl}/blog/tag/${tag.slug}`,
    },
    openGraph: {
      title: `${tag.name} | مقالات سیستم‌های حفاظتی`,
      description: `مطالب و مقالات مرتبط با برچسب ${tag.name}.`,
      url: `${siteUrl}/blog/tag/${tag.slug}`,
      siteName: "مقالات سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "website",
    },
  };
}
