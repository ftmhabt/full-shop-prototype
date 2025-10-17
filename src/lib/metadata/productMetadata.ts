import { getProductBySlug } from "@/app/actions/products";
import { Metadata } from "next";

export async function getProductMetadata(slug: string): Promise<Metadata> {
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "محصول یافت نشد | فروشگاه سیستم‌های حفاظتی",
      description: "محصول مورد نظر در فروشگاه سیستم‌های حفاظتی موجود نیست.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} | خرید ${product.name} با بهترین قیمت`,
    description:
      product.summary !== ""
        ? product.summary
        : `خرید ${product.name}، ${
            product.category.name || "سیستم حفاظتی"
          } با گارانتی اصلی و ارسال سریع از فروشگاه سیستم‌های حفاظتی.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | فروشگاه سیستم‌های حفاظتی`,
      description:
        product.summary !== ""
          ? product.summary
          : `فروش ${product.name}، شامل مشخصات، قیمت و تصاویر با گارانتی معتبر.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      siteName: "فروشگاه سیستم‌های حفاظتی",
      locale: "fa_IR",
      type: "website",
      images: product.image[0]
        ? [`${process.env.NEXT_PUBLIC_SITE_URL}${product.image[0]}`]
        : [],
    },
  };
}
