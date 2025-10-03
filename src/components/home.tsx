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
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Cog,
  CreditCard,
  Headphones,
  Percent,
  RefreshCw,
  Siren,
  Truck,
  Wrench,
} from "lucide-react";
import * as React from "react";

import { get4BlogPosts } from "@/app/actions/blog";
import CategorySection, { IconName } from "@/components/home/CategorySection";
import Hero from "@/components/home/Hero";
import HotProducts from "@/components/home/HotProducts";
import NewProducts from "@/components/home/NewProducts";
import db from "@/lib/db";
import { standardizeProducts } from "@/lib/standardisation";
import { BlogCategory, BlogPost, User } from "@prisma/client";
import Link from "next/link";
import { FallbackImage } from "./FallbackImage";
import BlogPostCard from "./blog/BlogPostCard";

const ICONS = [
  "Siren",
  "Camera",
  "Cable",
  "Lock",
  "Shield",
  "Box",
  "User",
  "ShoppingCart",
  "Home",
  "Key",
  "Bell",
  "Wifi",
];

const brands = ["azer", "classic", "futal", "silex", "melsec", "dahua"];

const posts = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  title: `راهنمای خرید و نصب دزدگیر — قسمت ${i + 1}`,
  image: "/images/blog.jpg",
  excerpt:
    "نکات کلیدی انتخاب، نصب و نگهداری سیستم‌های امنیتی برای منازل و اماکن تجاری.",
}));

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

function BuilderStrip() {
  return (
    <section className="mt-6">
      <Card className="rounded-3xl border-dashed">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-primary hidden sm:block" />
              <h1 className="font-bold text-lg">
                دستگاه دلخواهت رو همینجا بساز
              </h1>
            </div>

            <div>
              از هر دسته، قطعه‌ی مناسب رو انتخاب کن و سیستم امنیتی اختصاصی خودت
              رو مونتاژ کن — سریع، ساده و با نمایش قیمت لحظه‌ای.
            </div>
          </div>

          <Link href="/builder">
            <Button className="rounded-full">شروع انتخاب قطعات</Button>
          </Link>
        </CardContent>
      </Card>
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
              {/* {products.slice(i * 4, i * 4 + 4).map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                    <FallbackImage
                      src={p.image[0]}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs leading-5">{p.name}</div>
                </div>
              ))} */}
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
              <FallbackImage
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

function BlogRow({
  blogPosts,
}: {
  blogPosts: (BlogPost & {
    category: BlogCategory | null;
    author: User;
  })[];
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">مطالب خواندنی</h2>
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-1">
            مشاهده همه <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            categorySlug={post.category?.slug || ""}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt || ""}
            author={post.author.displayName || ""}
            date={new Date(post.createdAt).toLocaleDateString("fa-IR")}
          />
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
export default async function HomePage() {
  const [heroSlides, categories, newProducts, popularProducts] =
    await Promise.all([
      db.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.category.findMany(),
      db.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          attributes: {
            include: {
              value: {
                include: {
                  attribute: true,
                },
              },
            },
          },
          category: true,
          reviews: { include: { user: true } },
        },
      }),
      db.product.findMany({
        orderBy: { soldCount: "desc" },
        take: 8,
        include: {
          attributes: {
            include: {
              value: {
                include: {
                  attribute: true,
                },
              },
            },
          },
          category: true,
          reviews: { include: { user: true } },
        },
      }),
    ]);
  const standardizedCategories = categories.map((c) => {
    const dbIcon = (c.icon ?? "").replace(/\s/g, "");
    const iconKey = ICONS.find(
      (k) => k.toLowerCase() === dbIcon.toLowerCase()
    ) as IconName | undefined;
    return {
      id: c.id,
      label: c.name,
      slug: c.slug,
      icon: iconKey,
    };
  });
  const standardizedNewProducts = await standardizeProducts(newProducts);
  const standardizedPopularProducts = await standardizeProducts(
    popularProducts
  );
  const blogPosts = await get4BlogPosts();
  return (
    <main dir="rtl" className="container mx-auto max-w-7xl px-3 py-6">
      <Hero heroSlides={heroSlides} />
      <CategorySection categories={standardizedCategories} />
      {/* <DealStrip /> */}
      <BuilderStrip />
      <NewProducts products={standardizedNewProducts} />
      <HotProducts products={standardizedPopularProducts} />
      <PromoRow />
      <Collections />
      <BrandStrip />
      <BlogRow blogPosts={blogPosts} />
      <ServiceBar />
      <Newsletter />
    </main>
  );
}
