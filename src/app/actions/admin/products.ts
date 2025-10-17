"use server";

import { db } from "@/lib/db";
import { tomanToUsdWithMarkup } from "@/lib/exchange";
import { revalidatePath } from "next/cache";

// Create Product

export async function createProduct(data: {
  name: string;
  slug: string;
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
  const finalPriceUSD = await tomanToUsdWithMarkup(data.price ?? 0, true);

  const product = await db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: finalPriceUSD,
      oldPrice: data.oldPrice,
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
  const finalPriceUSD = await tomanToUsdWithMarkup(price ?? 0, false);
  // Start a transaction to update product and attributes together
  return db.$transaction(async (tx) => {
    // Update main product fields
    await tx.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: finalPriceUSD,
        oldPrice,
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
