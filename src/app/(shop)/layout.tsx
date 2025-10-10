import "@/app/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import CategoryNav from "@/components/server/CategoryNav";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: {
    default: "فروشگاه سیستم‌های حفاظتی",
    template: "%s | فروشگاه سیستم‌های حفاظتی",
  },
  description:
    "خرید آنلاین انواع دزدگیر، دوربین مداربسته، و تجهیزات امنیتی با ارسال سریع و گارانتی اصلی.",
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL },
  openGraph: {
    title: "فروشگاه سیستم‌های حفاظتی",
    description:
      "عرضه‌کننده برتر سیستم‌های حفاظتی برای منزل و محل کار با بهترین قیمت.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClientWrapper categoryNav={<CategoryNav />}>{children}</ClientWrapper>
    </ThemeProvider>
  );
}
