import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Phone, Search, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

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
              className="flex items-center gap-2 font-bold text-lg"
            >
              <Image
                src="/logo.png"
                alt="لوگو"
                width={40}
                height={40}
                className="object-contain"
              />
              صیادی شاپ
            </Link>

            {/* Search Bar */}
            <div className="hidden flex-1 max-w-xl items-center gap-2 sm:flex">
              <Input
                type="text"
                placeholder="جستجوی محصولات..."
                className="rounded-full"
              />
              <Button size="icon" className="rounded-full">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <a
                href="tel:09123456789"
                className="flex items-center gap-1 text-sm text-primary"
              >
                <Phone className="h-4 w-4" /> ۰۹۱۲۳۴۵۶۷۸۹
              </a>
            </div>
          </div>

          {/* Nav */}
          <nav className="border-t">
            <div className="container mx-auto flex items-center gap-6 overflow-x-auto p-3 text-sm">
              <Link href="/">خانه</Link>
              <Link href="/alarms">دزدگیر اماکن</Link>
              <Link href="/cctv">دوربین مداربسته</Link>
              <Link href="/access-control">کنترل تردد</Link>
              <Link href="/smart-home">هوشمندسازی</Link>
              <Link href="/blog">مقالات</Link>
              <Link href="/contact">تماس با ما</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto min-h-[60vh] px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-10">
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
            <p>© 2025 صیادی شاپ - همه حقوق محفوظ است</p>
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
