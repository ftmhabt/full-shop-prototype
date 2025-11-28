"use client";
import "@/app/globals.css";
import SearchBar from "@/components/home/SearchBar";
import { Separator } from "@/components/ui/separator";
import { store } from "@/store";
import { hydrate } from "@/store/cartSlice";
import { Home, Package, Phone, ScrollText, User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch } from "react-redux";
import { FallbackImage } from "./FallbackImage";
import ResponsiveCart from "./ResponsiveCart";
import { ThemeSwitcher } from "./common/ThemeSwitcher";

export default function ClientWrapper({
  children,
  categoryNav,
}: {
  children: React.ReactNode;
  categoryNav: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <HydrateCart /> {/* ✅ child component handles hydration */}
      <Header categoryNav={categoryNav} />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="container mx-auto min-h-[60vh] px-4 py-6 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </Provider>
  );
}

function HydrateCart() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Add a check to ensure we're on the client
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem("cart");
      dispatch(hydrate(storedCart ? JSON.parse(storedCart) : []));
    }
  }, [dispatch]);

  return null;
}

function Header({ categoryNav }: { categoryNav: React.ReactNode }) {
  return (
    <header className="border-b  shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-4 p-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg ml-auto sm:ml-0"
        >
          <div className='relative w-[40px] h-[48.33px]'>
            <FallbackImage src="/logo.png" alt="لوگو" fill />
          </div>
          <span className='mt-[5px]'>شاپ</span>
        </Link>
        
        {/* Icons */}
        <div className="flex justify-end items-center gap-1 flex-2">
          {/* Search Bar */}
          <div className="flex md:justify-center justify-end flex-2"><SearchBar /></div>
          <ThemeSwitcher />
          <Link
            href="/dashboard"
            className="flex justify-center items-center gap-1 text-sm text-primary size-9 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-full"
          >
            <User className="h-4 w-4" />
          </Link>
          <ResponsiveCart />
          <a
            href="tel:09123456789"
            className="flex items-center gap-1 text-sm text-primary h-9"
          >
            <Phone className="h-4 w-4 mr-[10px]" />
            <span className="hidden sm:inline-block mt-[2.66px]">۰۹۱۲۳۴۵۶۷۸۹</span>
          </a>
        </div>
      </div>

      {/* Nav */}
      <nav className="border-t">
        <div className="container mx-auto flex items-center gap-6 overflow-x-auto p-3 text-sm *:text-nowrap">
          <Link href="/">
            <div className="flex items-center gap-1">
              <div>خانه</div> <Home size={14} />
            </div>
          </Link>
          {categoryNav}
          <Link href="/blog">
            <div className="flex items-center gap-1">
              <div>مقالات</div> <ScrollText size={14} />
            </div>
          </Link>
          <Link href="/builder">
            <div className="flex items-center gap-1">
              <div>محصول سفارشی</div> <Package size={14} />
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-10 text-sm sm:grid-cols-4">
        <div>
          <h3 className="mb-3 font-bold">فروشگاه آنلاین سیستم‌های حفاظتی</h3>
          <p className="text-muted-foreground leading-6">
            فروش تخصصی دزدگیر اماکن، دوربین مداربسته و تجهیزات امنیتی با ارسال
            سریع و قیمت رقابتی.
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
        <p>© {new Date().getFullYear()} شاپ - همه حقوق محفوظ است</p>
        <div className="flex gap-3">
          <Link href="https://www.instagram.com" target="_blank">اینستاگرام</Link>
          <Link href="https://web.telegram.org" target="_blank">تلگرام</Link>
          <Link href="https://www.youtube.com" target="_blank">یوتیوب</Link>
        </div>
      </div>
    </footer>
  );
}
