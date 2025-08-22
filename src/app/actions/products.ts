"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getCategories() {
  return db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export async function getProductsByCategorySlug(
  slug: string,
  filters: Record<string, string[]> = {}
) {
  const where: Prisma.ProductWhereInput = {
    category: { is: { slug } },
  };

  // In Stock filter
  if (filters.inStock?.includes("true")) {
    where.stock = { gt: 0 };
  }

  // Attribute filters
  if (Object.keys(filters).length > 0) {
    where.AND = Object.entries(filters)
      .filter(([k]) => k !== "inStock")
      .map(([attributeId, values]) => ({
        attributes: {
          some: { value: { attributeId, id: { in: values } } },
        },
      }));
  }

  return db.product.findMany({
    where,
    include: {
      attributes: {
        include: { value: { include: { attribute: true } } },
      },
    },
  });
}

export async function getAttributesByCategorySlug(slug: string) {
  return db.attribute.findMany({
    where: { category: { slug } },
    include: { values: true },
    orderBy: { name: "asc" },
  });
}
