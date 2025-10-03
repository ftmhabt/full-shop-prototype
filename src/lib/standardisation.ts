import { StandardizedProduct } from "@/components/home/HotProducts";
import { Product as PrismaProduct } from "@prisma/client";
import { usdToToman } from "./exchange";

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
      content: string; // Prisma field
      user: { displayName: string | null }; // Prisma allows null
    }[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
  })[]
): Promise<StandardizedProduct[]> {
  return await Promise.all(
    products.map(async (p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      image: p.image,
      badge: p.badge,
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      oldPriceToman: p.oldPrice ? await usdToToman(Number(p.oldPrice)) : null,
      price: Number(p.price),
      priceToman: await usdToToman(Number(p.price)),
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
    }))
  );
}
