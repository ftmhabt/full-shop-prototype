"use server";

import { db } from "@/lib/db";
import { tomanToUsdWithMarkup, usdToToman } from "@/lib/exchange";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 10;

export async function getPaginatedProducts(page: number, query?: string) {
  const where = query
    ? {
        name: { contains: query, mode: "insensitive" as Prisma.QueryMode },
      }
    : {};

  const totalCount = await db.product.count({ where });

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { reviews: true },
  });

  const productsWithToman = await Promise.all(
    products.map(async (p) => ({
      ...p,
      price: p.price.toNumber(),
      oldPrice: p.oldPrice?.toNumber(),
      priceToman: await usdToToman(p.price?.toNumber()),
    }))
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return { products: productsWithToman, totalPages };
}

// Create Product
export async function createProduct(data: {
  name: string;
  slug: string;
  summary: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  badge?: string;
  categoryId: string;
  brandId?: string;
  image: string[];
  attributeValueIds: string[];
}) {
  const priceUSD = await tomanToUsdWithMarkup(data.price ?? 0, false);
  const oldPriceUSD = await tomanToUsdWithMarkup(data.oldPrice ?? 0, false);

  const product = await db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      price: priceUSD,
      oldPrice: oldPriceUSD,
      stock: data.stock,
      badge: data.badge,
      category: {
        connect: { id: data.categoryId },
      },
      brand: {
        connect: { id: data.brandId },
      },
      image: data.image,
    },
  });

  if (data.attributeValueIds?.length > 0) {
    await db.productAttribute.createMany({
      data: data.attributeValueIds.map((id) => ({
        productId: product.id,
        valueId: id,
      })),
    });
  }

  revalidatePath("/admin/products");
  return;
}

// Update Product

interface UpdateProductInput {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  badge?: string;
  categoryId: string;
  brandId?: string;
  image: string[]; // all images
  attributeValueIds?: string[];
}

export async function updateProduct(data: UpdateProductInput) {
  const {
    id,
    name,
    slug,
    summary,
    description,
    price,
    oldPrice,
    stock,
    badge,
    categoryId,
    brandId,
    image,
    attributeValueIds = [],
  } = data;
  const priceUSD = await tomanToUsdWithMarkup(price ?? 0, false);
  const oldPriceUSD = await tomanToUsdWithMarkup(oldPrice ?? 0, false);
  // Start a transaction to update product and attributes together
  return db.$transaction(async (tx) => {
    // Update main product fields
    await tx.product.update({
      where: { id },
      data: {
        name,
        slug,
        summary,
        description,
        price: priceUSD,
        oldPrice: oldPriceUSD,
        stock,
        badge,
        categoryId,
        brandId,
        image,
      },
    });

    // Remove existing product attributes
    await tx.productAttribute.deleteMany({ where: { productId: id } });

    // Add new attribute relations
    if (attributeValueIds.length > 0) {
      const attributeRelations = attributeValueIds.map((valueId) => ({
        productId: id,
        valueId,
      }));
      await tx.productAttribute.createMany({ data: attributeRelations });
    }
    revalidatePath("/admin/products");
    return;
  });
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    throw new Error(
      "این محصول نمی‌تواند حذف شود زیرا سفارش‌هایی به آن مرتبط هستند."
    );
  }
  revalidatePath("/admin/products");
}
