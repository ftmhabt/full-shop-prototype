import { StandardizedProduct } from "@/types";
import { Product as PrismaProduct } from "@prisma/client";
import { getRateCached } from "./exchangeCache";
import { getLatestRate } from "./latestRate";

export async function standardizeProducts(
  products: (PrismaProduct & {
    attributes: {
      id: string;
      value: {
        id: string;
        value: string;
        attribute: {
          id: string;
          name: string;
          slug: string;
        };
      };
    }[];
    reviews: {
      id: string;
      rating: number;
      content: string;
      user: { displayName: string | null };
    }[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
    brand: { id: string; name: string; slug: string } | null;
  })[]
): Promise<StandardizedProduct[]> {
  const rate = await getRateCached(getLatestRate);

  return await Promise.all(
    products.map(async (p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      image: p.image,
      badge: p.badge,
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      oldPriceToman: p.oldPrice ? Math.round(Number(p.oldPrice) * rate) : null,
      price: Number(p.price),
      priceToman: Math.round(Number(p.price) * rate),
      rating: p.rating,
      stock: p.stock,
      soldCount: p.soldCount,
      categoryId: p.categoryId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,

      attributes: p.attributes.map((a) => ({
        id: a.id,
        value: {
          id: a.value.id,
          value: a.value.value,
          attribute: {
            id: a.value.attribute.id,
            name: a.value.attribute.name,
            slug: a.value.attribute.slug,
          },
        },
      })),

      reviews: p.reviews.map((r) => ({
        id: r.id,
        rating: r.rating ?? 0,
        comment: r.content ?? "",
        user: {
          displayName: r.user.displayName ?? "",
        },
      })),

      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      },
      brand: p.brand
        ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug }
        : null,
    }))
  );
}
