import { db } from "@/lib/db";
import { ProductWithAttributes } from "@/types";
import { Prisma } from "@prisma/client";

export async function getCategoriesBySearch(q: string) {
  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { category: true },
  });

  const categoryMap: Record<
    string,
    { id: string; name: string; slug: string }
  > = {};
  for (const p of products) {
    if (!categoryMap[p.category.id]) {
      categoryMap[p.category.id] = {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      };
    }
  }

  return Object.values(categoryMap);
}

export async function getProductsBySearch(
  query: string,
  filters: Record<string, string[]>,
  orderBy: string = "newest",
  slug?: string
): Promise<{ products: ProductWithAttributes[] }> {
  const { inStock, ...otherFilters } = filters;

  const where: Prisma.ProductWhereInput = {
    ...(slug ? { category: { slug } } : {}),
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
  };

  if (inStock?.includes("true")) {
    where.stock = { gt: 0 };
  }

  const attributeFilters = Object.entries(otherFilters);
  if (attributeFilters.length) {
    where.AND = attributeFilters.map(([attrSlug, valueSlugs]) => ({
      attributes: {
        some: {
          value: {
            slug: { in: valueSlugs },
            attribute: { slug: attrSlug },
          },
        },
      },
    }));
  }

  let orderByClause: Prisma.ProductOrderByWithRelationInput;
  switch (orderBy) {
    case "oldest":
      orderByClause = { createdAt: "asc" };
      break;
    case "priceAsc":
      orderByClause = { price: "asc" };
      break;
    case "priceDesc":
      orderByClause = { price: "desc" };
      break;
    default:
      orderByClause = { createdAt: "desc" };
      break;
  }

  const products = await db.product.findMany({
    where,
    include: {
      attributes: {
        include: { value: { include: { attribute: true } } },
      },
      category: true,
      reviews: {
        include: {
          user: { select: { displayName: true } },
        },
      },
      brand: true,
    },
    orderBy: orderByClause,
  });

  return { products };
}
