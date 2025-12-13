import { SiteSchemas } from "@/components/SEO/SiteSchemas";
import localFont from 'next/font/local';
import "./globals.css";
import { Providers } from "./providers";
import { getThemeCookie } from '@/app/actions/theme';

const vazirMatn = localFont({
    src:'../../public/fonts/Vazirmatn-Variable.ttf',
    style: 'normal',
    variable: '--font-vazirmatn',
    display: 'swap',
    fallback: ['system-ui', 'sans-serif'],
    preload: false,
});

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
  icons: {
    apple: [
        {url: '/apple-icon-152x152.png', sizes: '152x152'},
        {url: '/apple-icon-180x180.png', sizes: '180x180'}
    ],
    other: [
        {url: '/android-icon-144x144.png', sizes: '144x144'},
        {url: '/android-icon-192x192.png', sizes: '192x192'}
    ]
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const savedTheme = await getThemeCookie();

  return (
    <html lang="fa" className={`${vazirMatn.variable}`} dir="rtl" suppressHydrationWarning>
      <body>
        <Providers savedTheme={savedTheme}>{children}</Providers>
        <SiteSchemas />
      </body>
    </html>
  );
}
