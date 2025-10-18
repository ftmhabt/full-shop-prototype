import type { Metadata } from "next";

export async function getBlogPageMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    title: "مقالات و آموزش‌ها | فروشگاه سیستم‌های حفاظتی",
    description:
      "جدیدترین مقالات آموزشی درباره دوربین مداربسته، دزدگیر، و سیستم‌های امنیتی با تحلیل‌های تخصصی و راهنمای خرید.",
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
    openGraph: {
      title: "مقالات و آموزش‌های سیستم‌های حفاظتی",
      description:
        "مطالب تخصصی و آموزشی درباره سیستم‌های حفاظتی، نصب دوربین مدار بسته و تجهیزات امنیتی.",
      url: `${siteUrl}/blog`,
      siteName: "فروشگاه سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "website",
    },
  };
}
