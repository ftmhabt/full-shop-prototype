import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost"),
  title: {
    default: "فروشگاه سیستم‌های حفاظتی | امنیت خانه و محل کار",
    template: "%s | فروشگاه سیستم‌های حفاظتی",
  },
  description:
    "فروش و نصب انواع سیستم‌های حفاظتی شامل دزدگیر، دوربین مداربسته، تجهیزات نظارتی و قطعات جانبی با بهترین قیمت و گارانتی معتبر.",
  keywords: [
    "دزدگیر",
    "دوربین مداربسته",
    "سیستم حفاظتی",
    "نصب دوربین",
    "امنیت منزل",
    "فروش تجهیزات امنیتی",
  ],
  openGraph: {
    title: "فروشگاه سیستم‌های حفاظتی",
    description:
      "عرضه‌کننده‌ی انواع دزدگیر، دوربین مداربسته و قطعات حفاظتی با گارانتی و خدمات نصب.",
    siteName: "فروشگاه سیستم‌های حفاظتی",
    locale: "fa_IR",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
      bing: process.env.BING_VERIFICATION_CODE,
      yandex: process.env.YANDEX_VERIFICATION_CODE,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
