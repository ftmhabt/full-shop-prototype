"use server";

import { db } from "@/lib/db";

export async function getCategories() {
  return db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export async function getProductsByCategorySlug(
  slug: string,
  filters: Record<string, string[]>
) {
  const { orderBy, ...otherFilters } = filters;

  // build Prisma where clause
  const where: any = {
    category: { slug },
  };

  // inStock filter
  if (otherFilters.inStock?.includes("true")) {
    where.stock = { gt: 0 };
  }

  // attribute filters
  if (Object.keys(otherFilters).length > 0) {
    where.attributes = {
      some: {
        valueId: { in: Object.values(otherFilters).flat() },
      },
    };
  }

  // build Prisma orderBy
  let orderByClause: any = { createdAt: "desc" }; // default newest

  if (orderBy?.length) {
    switch (orderBy[0]) {
      case "oldest":
        orderByClause = { createdAt: "asc" };
        break;
      case "priceAsc":
        orderByClause = { price: "asc" };
        break;
      case "priceDesc":
        orderByClause = { price: "desc" };
        break;
      case "newest":
      default:
        orderByClause = { createdAt: "desc" };
        break;
    }
  }

  return db.product.findMany({
    where,
    include: {
      attributes: {
        include: {
          value: { include: { attribute: true } },
        },
      },
    },
    orderBy: orderByClause,
  });
}

export async function getAttributesByCategorySlug(slug: string) {
  return db.attribute.findMany({
    where: { category: { slug } },
    include: { values: true },
    orderBy: { name: "asc" },
  });
}
