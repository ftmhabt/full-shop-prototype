import "@/app/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import { FallbackImage } from "@/components/FallbackImage";
import SearchBar from "@/components/home/SearchBar";
import ResponsiveCart from "@/components/ResponsiveCart";
import { Separator } from "@/components/ui/separator";
import { Phone, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "فروشگاه سیستم‌های حفاظتی",
  description: "دزدگیر اماکن، دوربین مداربسته، اعلام حریق و تجهیزات امنیتی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-background text-foreground">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto flex items-center justify-between gap-4 p-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg ml-auto sm:ml-0"
            >
              <FallbackImage
                src="/logo.png"
                alt="لوگو"
                width={40}
                height={40}
              />
              شاپ
            </Link>

            {/* Search Bar */}
            <SearchBar />

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-sm text-primary"
              >
                <User className="h-4 w-4" />
              </Link>
              <ClientWrapper>
                <ResponsiveCart />
              </ClientWrapper>
              <a
                href="tel:09123456789"
                className="flex items-center gap-1 text-sm text-primary"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline-block">۰۹۱۲۳۴۵۶۷۸۹</span>
              </a>
            </div>
          </div>

          {/* Nav */}
          <nav className="border-t">
            <div className="container mx-auto flex items-center gap-6 overflow-x-auto p-3 text-sm *:text-nowrap">
              <Link href="/">خانه</Link>
              <Link href="/category/alarm-systems">دزدگیر اماکن</Link>
              <Link href="/category/cctv-cameras">دوربین مداربسته</Link>
              <Link href="/category/access-control">کنترل تردد</Link>
              <Link href="/category/smart-home">هوشمندسازی</Link>
              <Link href="/blog">مقالات</Link>
              <Link href="/contact">تماس با ما</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto min-h-[60vh] px-4 py-6 flex items-center justify-center">
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30">
          <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-10 text-sm sm:grid-cols-4">
            <div>
              <h3 className="mb-3 font-bold">
                فروشگاه آنلاین سیستم‌های حفاظتی
              </h3>
              <p className="text-muted-foreground leading-6">
                فروش تخصصی دزدگیر اماکن، دوربین مداربسته و تجهیزات امنیتی با
                ارسال سریع و قیمت رقابتی.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-bold">راهنمای خرید</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#">شیوه‌های ارسال</Link>
                </li>
                <li>
                  <Link href="#">روش‌های پرداخت</Link>
                </li>
                <li>
                  <Link href="#">سوالات متداول</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold">خدمات مشتریان</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#">گارانتی و بازگشت کالا</Link>
                </li>
                <li>
                  <Link href="#">پشتیبانی فنی</Link>
                </li>
                <li>
                  <Link href="#">آموزش نصب</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-bold">ارتباط با ما</h3>
              <ul className="space-y-2">
                <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷</li>
                <li>واتساپ: ۰۹۱۲۳۴۵۶۷۸۹</li>
                <li>ایمیل: info@example.com</li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
            <p>© 2025 شاپ - همه حقوق محفوظ است</p>
            <div className="flex gap-3">
              <Link href="#">اینستاگرام</Link>
              <Link href="#">تلگرام</Link>
              <Link href="#">یوتیوب</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
