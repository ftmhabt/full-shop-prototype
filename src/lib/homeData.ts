import { IconName } from "@/components/home/CategorySection";
import { ICONS } from "@/constants/home";
import db from "@/lib/db";
import { standardizeProducts } from "@/lib/standardisation";
import { cache } from "react";

export const getHomeData = cache(async () => {
  const [heroSlides, categories] = await Promise.all([
    db.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    db.category.findMany(),
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

  return {
    heroSlides,
    standardizedCategories,
  };
});
export type HomeData = Awaited<ReturnType<typeof getHomeData>>;

export const get4NewProducts = cache(async () => {
  const newProducts = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      attributes: { include: { value: { include: { attribute: true } } } },
      category: true,
      reviews: { include: { user: true } },
      brand: true,
    },
  });
  const standardizedNewProducts = await standardizeProducts(newProducts);
  return standardizedNewProducts;
});

export const get4PopularProducts = cache(async () => {
  const popularProducts = await db.product.findMany({
    orderBy: { soldCount: "desc" },
    take: 8,
    include: {
      attributes: { include: { value: { include: { attribute: true } } } },
      category: true,
      reviews: { include: { user: true } },
      brand: true,
    },
  });

  const standardizedPopularProducts = await standardizeProducts(
    popularProducts
  );
  return standardizedPopularProducts;
});
