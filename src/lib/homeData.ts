import { get4BlogPosts } from "@/app/actions/blog";
import { IconName } from "@/components/home/CategorySection";
import { ICONS } from "@/constants/home";
import db from "@/lib/db";
import { standardizeProducts } from "@/lib/standardisation";

export async function getHomeData() {
  const [heroSlides, categories, newProducts, popularProducts, blogPosts] =
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
          attributes: { include: { value: { include: { attribute: true } } } },
          category: true,
          reviews: { include: { user: true } },
        },
      }),
      db.product.findMany({
        orderBy: { soldCount: "desc" },
        take: 8,
        include: {
          attributes: { include: { value: { include: { attribute: true } } } },
          category: true,
          reviews: { include: { user: true } },
        },
      }),
      get4BlogPosts(),
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
    standardizedNewProducts: await standardizeProducts(newProducts),
    standardizedPopularProducts: await standardizeProducts(popularProducts),
    blogPosts,
  };
}
export type HomeData = Awaited<ReturnType<typeof getHomeData>>;
