"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Cable,
  Camera,
  ChevronRight,
  CreditCard,
  Headphones,
  Lock,
  Percent,
  RefreshCw,
  Shield,
  ShoppingCart,
  Siren,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ---- Mock Data (replace with API) -----------------------------------------
const heroSlides = [
  {
    id: 1,
    title: "امنیت با اطمینان، آرامش با حس خوب!",
    subtitle: "تخفیف‌های استثنایی",
    image: "/images/hero-1.jpg",
  },
  {
    id: 2,
    title: "انواع دوربین های تحت شبکه و AHD",
    subtitle: "گارانتی رسمی و ارسال سریع",
    image: "/images/hero-2.jpg",
  },
];

const categories = [
  { id: 1, label: "دزدگیر اماکن", icon: <Siren className="h-6 w-6" /> },
  { id: 2, label: "دوربین مداربسته", icon: <Camera className="h-6 w-6" /> },
  { id: 3, label: "لوازم جانبی", icon: <Cable className="h-6 w-6" /> },
  { id: 4, label: "کنترل تردد", icon: <Lock className="h-6 w-6" /> },
  { id: 5, label: "هوشمندسازی", icon: <Shield className="h-6 w-6" /> },
];

const products = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: `محصول شماره ${i + 1}`,
  price: 1490000 + i * 120000,
  oldPrice: i % 2 ? 1690000 + i * 120000 : undefined,
  image: "/images/product-placeholder.png",
  rating: 4 + (i % 2 ? 0.5 : 0),
  badge: i % 3 === 0 ? "پیشنهاد شگفت‌انگیز" : undefined,
}));

const brands = ["azer", "classic", "futal", "silex", "melsec", "dahua"];

const posts = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  title: `راهنمای خرید و نصب دزدگیر — قسمت ${i + 1}`,
  image: "/images/blog.jpg",
  excerpt:
    "نکات کلیدی انتخاب، نصب و نگهداری سیستم‌های امنیتی برای منازل و اماکن تجاری.",
}));

// ---- UI Building Blocks ---------------------------------------------------
function Price({ value, old }: { value: number; old?: number }) {
  const format = (n: number) => n.toLocaleString("fa-IR");
  return (
    <div className="flex items-center gap-2">
      {old ? (
        <span className="text-muted-foreground line-through text-sm">
          {format(old)} تومان
        </span>
      ) : null}
      <span className="font-bold">{format(value)} تومان</span>
    </div>
  );
}

function ProductCard({ p }: { p: (typeof products)[number] }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-muted/40">
      <CardContent className="p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={p.image}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {p.badge && (
            <Badge className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs">
              <Percent className="ml-1 h-3 w-3" /> {p.badge}
            </Badge>
          )}
          <Button
            size="sm"
            className="absolute bottom-2 left-2 rounded-full"
            variant="secondary"
          >
            <ShoppingCart className="ml-1 h-4 w-4" /> افزودن به سبد
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          <Link href="#" className="line-clamp-2 text-sm font-medium leading-6">
            {p.title}
          </Link>
          <div className="flex items-center justify-between">
            <Price value={p.price} old={p.oldPrice} />
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(p.rating) ? "fill-current" : "opacity-30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IconCategory({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className="flex h-auto flex-col items-center gap-3 rounded-2xl p-4"
    >
      <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
      <span className="text-xs">{label}</span>
    </Button>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border p-4">
      <div className="rounded-xl bg-muted p-2">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

// ---- Sections -------------------------------------------------------------
function Hero() {
  return (
    <section className="relative w-full">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {heroSlides.map((s) => (
            <CarouselItem key={s.id}>
              <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-0">
                <div className="relative h-[260px] w-full sm:h-[360px] md:h-[420px]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute right-6 top-6 max-w-xl text-right text-white drop-shadow">
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-extrabold sm:text-3xl md:text-4xl"
                    >
                      {s.title}
                    </motion.h1>
                    <p className="mt-2 text-sm opacity-90">{s.subtitle}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                      >
                        <Link href="#">مشاهده پیشنهادها</Link>
                      </Button>
                      <Button asChild size="sm" className="rounded-full">
                        <Link href="#">خرید کنید</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

function CategoryIcons() {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {categories.map((c) => (
          <IconCategory key={c.id} label={c.label} icon={c.icon} />
        ))}
      </div>
    </section>
  );
}

function DealStrip() {
  return (
    <section className="mt-6">
      <Card className="rounded-3xl border-dashed">
        <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Percent className="h-5 w-5 text-primary" />
            پیشنهاد شگفت‌انگیز امروز
          </div>
          <Button variant="outline" className="rounded-full">
            مشاهده همه
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function NewProducts() {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">جدیدترین محصولات</h2>
        <Button variant="ghost" size="sm" className="gap-1">
          مشاهده همه <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

function HotThisWeek() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">داغ‌ترین های هفته گذشته</h2>
        <Tabs defaultValue="cctv" className="hidden sm:block">
          <TabsList>
            <TabsTrigger value="cctv">دوربین</TabsTrigger>
            <TabsTrigger value="alarm">دزدگیر</TabsTrigger>
            <TabsTrigger value="access">کنترل تردد</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {products.map((p) => (
            <CarouselItem
              key={p.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4"
            >
              <ProductCard p={p} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />

        <CarouselNext />
      </Carousel>
    </section>
  );
}

function PromoRow() {
  return (
    <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {["باشگاه مشتریان", "خرید عمده و پروژه", "ابزار و یراق"].map((t, i) => (
        <Card key={i} className="relative overflow-hidden rounded-3xl">
          <CardContent className="flex h-32 items-end justify-between p-6">
            <div>
              <CardTitle className="text-base">{t}</CardTitle>
              <CardDescription>همین حالا اقدام کنید</CardDescription>
            </div>
            <Button size="sm" variant="secondary" className="rounded-full">
              ورود
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function Collections() {
  const cols = [
    { title: "دزدگیر اماکن", icon: <Siren className="h-5 w-5" /> },
    { title: "دوربین مداربسته", icon: <Camera className="h-5 w-5" /> },
    { title: "لوازم جانبی", icon: <Wrench className="h-5 w-5" /> },
  ];
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cols.map((c, i) => (
          <Card key={i} className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{c.title}</CardTitle>
              {c.icon}
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-3">
              {products.slice(i * 4, i * 4 + 4).map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                    <Image src={p.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="text-xs leading-5">{p.title}</div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="mr-auto gap-1">
                مشاهده بیشتر <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function BrandStrip() {
  return (
    <section className="mt-12">
      <Card className="rounded-3xl">
        <CardContent className="flex flex-wrap items-center justify-center gap-8 p-6">
          {brands.map((b) => (
            <div
              key={b}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                src={`/images/brands/${b}.png`}
                alt={b}
                width={96}
                height={32}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function BlogRow() {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">مطالب خواندنی</h2>
        <Button variant="ghost" size="sm" className="gap-1">
          مشاهده همه <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {posts.map((p) => (
          <Card key={p.id} className="overflow-hidden rounded-2xl">
            <div className="relative h-40 w-full">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {p.excerpt}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button size="sm" variant="secondary" className="rounded-full">
                ادامه مطلب
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ServiceBar() {
  const items = [
    {
      icon: <Headphones className="h-5 w-5" />,
      t: "پشتیبانی ۲۴ ساعته",
      d: "مشاوره قبل و بعد از خرید",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      t: "پرداخت امن",
      d: "درگاه‌ های رسمی بانکی",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      t: "ارسال سریع",
      d: "به سراسر ایران",
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      t: "ضمانت اصالت کالا",
      d: "مهلت تست و بازگشت",
    },
  ];
  return (
    <section className="mt-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((i, idx) => (
          <FeatureItem key={idx} icon={i.icon} title={i.t} desc={i.d} />
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mt-12">
      <Card className="rounded-3xl">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-right">
          <div>
            <CardTitle>عضویت در خبرنامه</CardTitle>
            <CardDescription>
              برای اطلاع از تخفیف‌ها و محصولات جدید ایمیل خود را وارد کنید.
            </CardDescription>
          </div>
          <div className="flex w-full max-w-lg items-center gap-2">
            <Input dir="ltr" type="email" placeholder="you@example.com" />
            <Button className="shrink-0">ثبت</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// ---- Page -----------------------------------------------------------------
export default function HomePage() {
  return (
    <main dir="rtl" className="container mx-auto max-w-7xl px-3 py-6">
      <Hero />
      <CategoryIcons />
      <DealStrip />
      <NewProducts />
      <HotThisWeek />
      <PromoRow />
      <Collections />
      <BrandStrip />
      <BlogRow />
      <ServiceBar />
      <Newsletter />
      <Separator className="my-10" />
      <footer className="grid grid-cols-2 gap-6 text-sm text-muted-foreground sm:grid-cols-4">
        <div>
          <div className="text-base font-bold text-foreground">
            فروشگاه آنلاین سیستم‌های حفاظتی
          </div>
          <p className="mt-2 leading-7">
            فروش تخصصی دزدگیر اماکن، دوربین مداربسته، اعلام حریق و لوازم جانبی
            با قیمت رقابتی و ارسال فوری.
          </p>
        </div>
        <div>
          <div className="font-semibold text-foreground">راهنمای خرید</div>
          <ul className="mt-2 space-y-2">
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
          <div className="font-semibold text-foreground">خدمات پس از فروش</div>
          <ul className="mt-2 space-y-2">
            <li>
              <Link href="#">گارانتی و مرجوعی</Link>
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
          <div className="font-semibold text-foreground">ارتباط با ما</div>
          <ul className="mt-2 space-y-2">
            <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷</li>
            <li>واتساپ: ۰۹۱۲۳۴۵۶۷۸۹</li>
            <li>آدرس: تهران، ...</li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
