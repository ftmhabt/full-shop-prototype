"use server";

import { db } from "@/lib/db";
import { AttributeWithValues, ProductWithAttributes } from "@/types";
import { Prisma } from "@prisma/client";

export async function getCategories() {
  return db.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

export async function getProductsByCategorySlug(
  slug: string,
  filters: Record<string, string[]>
): Promise<ProductWithAttributes[]> {
  const { orderBy, ...otherFilters } = filters;

  const where: Prisma.ProductWhereInput = {
    category: { slug },
  };

  // موجودی
  if (otherFilters.inStock?.includes("true")) {
    where.stock = { gt: 0 };
  }

  // فیلتر ویژگی‌ها با slug
  const attributeFilters = Object.entries(otherFilters).filter(
    ([key]) => key !== "inStock"
  );
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

  // مرتب‌سازی
  let orderByClause: Prisma.ProductOrderByWithRelationInput = {
    createdAt: "desc",
  };
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

export async function getProductsBySearch(
  query: string,
  filters: Record<string, string[]> = {},
  orderBy: string = "newest"
): Promise<{
  products: ProductWithAttributes[];
  attributes: AttributeWithValues[];
}> {
  const where: Prisma.ProductWhereInput = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
  };

  if (Object.keys(filters).length > 0) {
    where.AND = Object.entries(filters).map(([attrSlug, valueSlugs]) => ({
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

  // تعیین ترتیب مرتب‌سازی بر اساس orderBy
  let orderByClause: Prisma.ProductOrderByWithRelationInput = {
    createdAt: "desc",
  };
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
  }

  const products = await db.product.findMany({
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

  const attributeMap: Record<string, AttributeWithValues> = {};
  for (const p of products) {
    for (const pa of p.attributes) {
      const attr = pa.value.attribute;
      if (!attributeMap[attr.slug]) {
        attributeMap[attr.slug] = { ...attr, values: [] };
      }
      if (!attributeMap[attr.slug].values.find((v) => v.id === pa.value.id)) {
        attributeMap[attr.slug].values.push(pa.value);
      }
    }
  }

  return {
    products,
    attributes: Object.values(attributeMap),
  };
}
