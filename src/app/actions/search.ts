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

// export async function getProductsBySearch(
//   query: string,
//   filters: Record<string, string[]> = {},
//   orderBy: string = "newest",
//   slug?: string // 👈 اضافه کن
// ): Promise<{
//   products: ProductWithAttributes[];
//   attributes: AttributeWithValues[];
// }> {
//   const where: Prisma.ProductWhereInput = {
//     OR: [
//       { name: { contains: query, mode: "insensitive" } },
//       { description: { contains: query, mode: "insensitive" } },
//     ],
//   };

//   // 👇 فیلتر دسته‌بندی
//   if (slug) {
//     where.category = { slug };
//   }

//   if (Object.keys(filters).length > 0) {
//     where.AND = Object.entries(filters).map(([attrSlug, valueSlugs]) => ({
//       attributes: {
//         some: {
//           value: {
//             slug: { in: valueSlugs },
//             attribute: { slug: attrSlug },
//           },
//         },
//       },
//     }));
//   }

//   let orderByClause: Prisma.ProductOrderByWithRelationInput = {
//     createdAt: "desc",
//   };
//   switch (orderBy) {
//     case "oldest":
//       orderByClause = { createdAt: "asc" };
//       break;
//     case "priceAsc":
//       orderByClause = { price: "asc" };
//       break;
//     case "priceDesc":
//       orderByClause = { price: "desc" };
//       break;
//     default:
//       orderByClause = { createdAt: "desc" };
//   }

//   const products = await db.product.findMany({
//     where,
//     include: {
//       attributes: {
//         include: {
//           value: { include: { attribute: true } },
//         },
//       },
//     },
//     orderBy: orderByClause,
//   });

//   const attributeMap: Record<string, AttributeWithValues> = {};
//   for (const p of products) {
//     for (const pa of p.attributes) {
//       const attr = pa.value.attribute;
//       if (!attributeMap[attr.slug]) {
//         attributeMap[attr.slug] = { ...attr, values: [] };
//       }
//       if (!attributeMap[attr.slug].values.find((v) => v.id === pa.value.id)) {
//         attributeMap[attr.slug].values.push(pa.value);
//       }
//     }
//   }

//   return {
//     products,
//     attributes: Object.values(attributeMap),
//   };
// }

export async function getProductsBySearch(
  query: string,
  filters: Record<string, string[]>,
  orderBy: string = "newest",
  slug?: string
): Promise<{ products: ProductWithAttributes[] }> {
  const { inStock, orderBy: _orderBy, q, ...otherFilters } = filters;

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
    case "newest":
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
    },
    orderBy: orderByClause,
  });

  return { products };
}
