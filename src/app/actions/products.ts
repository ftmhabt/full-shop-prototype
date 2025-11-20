"use server";

import { db } from "@/lib/db";
import type { AttributeWithValues, ProductWithAttributes } from "@/types";
import { Prisma } from "@prisma/client";

export async function getProductBySlug(
  slug: string
): Promise<ProductWithAttributes> {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      attributes: {
        include: {
          value: {
            include: {
              attribute: true,
            },
          },
        },
      },
      category: true,
      brand: { select: { id: true, name: true, slug: true } },
      reviews: {
        include: {
          user: { select: { displayName: true } },
        },
      },
    },
  });

  if (!product) {
    throw new Error(`Product with slug "${slug}" not found`);
  }

  return product;
}

// Get all categories
export async function getCategories() {
  return db.category.findMany({
    select: { id: true, name: true, slug: true },
  });
}

export async function getRelatedProducts(
  categorySlug: string,
  limit: number = 4
) {
  return db.product.findMany({
    where: { category: { slug: categorySlug } },
    take: limit,
    orderBy: { createdAt: "desc" },
    // include: {
    //   attributes: {
    //     include: {
    //       value: { include: { attribute: true } },
    //     },
    //   },
    //   category: true,
    //   reviews: {
    //     include: { user: { select: { displayName: true } } },
    //   },
    //   brand: { select: { id: true, name: true, slug: true } },
    // },
  });
}

// Get products by category slug with filters and orderBy
export async function getProductsByCategorySlug(
  slug: string,
  filters: Record<string, string[]>,
  limit?: number,
  cursor?: string,
  page?: number
): Promise<ProductWithAttributes[]> {
  const { orderBy, query, ...otherFilters } = filters;

  const where: Prisma.ProductWhereInput = { category: { slug } };

  // Filter by stock
  if (otherFilters.inStock?.includes("true")) {
    where.stock = { gt: 0 };
  }

  // Search by name or description
  if (query?.length) {
    where.OR = [
      { name: { contains: query[0], mode: "insensitive" } },
      { description: { contains: query[0], mode: "insensitive" } },
    ];
  }

  // Filter by attribute slugs
  const attributeFilters = Object.entries(otherFilters).filter(
    ([key]) => key !== "inStock" && key !== "brand"
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

  // Filter by brand
  if (otherFilters.brand?.length) {
    where.brand = {
      slug: { in: otherFilters.brand },
    };
  }

  // Determine sorting
  let primaryOrder: Prisma.SortOrder = "desc";
  let sortField: keyof Prisma.ProductOrderByWithRelationInput = "createdAt";

  if (orderBy?.length) {
    switch (orderBy[0]) {
      case "oldest":
        sortField = "createdAt";
        primaryOrder = "asc";
        break;
      case "priceAsc":
        sortField = "price";
        primaryOrder = "asc";
        break;
      case "priceDesc":
        sortField = "price";
        primaryOrder = "desc";
        break;
      default:
        sortField = "createdAt";
        primaryOrder = "desc";
    }
  }

  // ✅ Stable order to avoid duplicates when multiple have same value
  const orderByClause: Prisma.ProductOrderByWithRelationInput[] = [
    { [sortField]: primaryOrder },
    { id: "asc" },
  ];

  const take = limit ?? 12;

  // 🧠 Decide which pagination mode to use
  const isCursorMode = !!cursor;

  const queryOptions: Prisma.ProductFindManyArgs = {
    where,
    include: {
      attributes: { include: { value: { include: { attribute: true } } } },
      category: true,
      reviews: { include: { user: { select: { displayName: true } } } },
      brand: { select: { id: true, name: true, slug: true } },
    },
    orderBy: orderByClause,
    take,
  };

  if (isCursorMode) {
    // Infinite scroll mode
    queryOptions.cursor = { id: cursor! };
    queryOptions.skip = 1; // skip the cursor item itself
  } else if (page && page > 1) {
    // Page-based mode
    queryOptions.skip = (page - 1) * take;
  }

  const products = await db.product.findMany(queryOptions);
  return products as ProductWithAttributes[];
}

// Get attributes with values for a category
export async function getAttributesByCategorySlug(slug: string) {
  return db.attribute.findMany({
    where: { category: { slug } },
    include: { values: true },
    orderBy: { name: "asc" },
  });
}

// Search products with filters and return both products and available attributes
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

  if (filters.inStock?.includes("true")) {
    where.stock = { gt: 0 };
  }

  const attributeFilters = Object.entries(filters).filter(
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
        include: { value: { include: { attribute: true } } },
      },
      category: true,
      reviews: { include: { user: { select: { displayName: true } } } },
      brand: { select: { id: true, name: true, slug: true } },
    },
    orderBy: orderByClause,
  });

  // Build attribute map for filtering options
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

export async function getBrandsByCategorySlug(slug: string) {
  return db.brand.findMany({
    where: {
      products: {
        some: {
          category: {
            slug,
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}
