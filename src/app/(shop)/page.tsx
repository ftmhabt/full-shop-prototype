export const revalidate = 10800;

import CategorySection from "@/components/home/CategorySection";
import Hero from "@/components/home/Hero";
import HotProducts from "@/components/home/HotProducts";
import LoadingSkeleton from "@/components/home/LoadingSkeleton";
import NewProducts from "@/components/home/NewProducts";
import BlogRow from "@/components/home/sections/BlogRow";
import BrandStrip from "@/components/home/sections/BrandStrip";
import BuilderStrip from "@/components/home/sections/BuilderStrip";
import Collections from "@/components/home/sections/Collections";
import Newsletter from "@/components/home/sections/Newsletter";
import PromoRow from "@/components/home/sections/PromoRow";
import ServiceBar from "@/components/home/sections/ServiceBar";
import { getHomeData } from "@/lib/homeData";
import { Suspense } from "react";

export async function generateMetadata() {
  const { heroSlides } = await getHomeData();
  const firstHeroImage = heroSlides[0]?.image;
  return {
    other: {
      "link:preload": [
        {
          rel: "preload",
          as: "image",
          href: firstHeroImage,
        },
      ],
    },
  };
}

export default async function HomePage() {
  const { heroSlides, standardizedCategories } = await getHomeData();

  return (
    <main dir="rtl" className="container mx-auto max-w-7xl p-0 sm:px-3 sm:py-6">
      <Hero heroSlides={heroSlides} />
      <CategorySection categories={standardizedCategories} />
      <BuilderStrip />
      <Suspense fallback={<LoadingSkeleton />}>
        <NewProducts />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <HotProducts />
      </Suspense>
      <PromoRow />
      <Collections />
      <BrandStrip />
      <Suspense fallback={<LoadingSkeleton />}>
        <BlogRow />
      </Suspense>
      <ServiceBar />
      <Newsletter />
    </main>
  );
}
