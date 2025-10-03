import { StandardizedProduct } from "@/components/home/HotProducts";
import { Product as PrismaProduct } from "@prisma/client";

export function standardizeProducts(
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
): StandardizedProduct[] {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    image: p.image,
    badge: p.badge,
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    price: Number(p.price),
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
      comment: r.content ?? "", // ✅ Prisma "content" → standardized "comment"
      user: {
        displayName: r.user.displayName ?? "", // ✅ force string
      },
    })),

    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
    },
  }));
}
