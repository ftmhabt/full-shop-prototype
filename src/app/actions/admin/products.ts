"use server";

import { db } from "@/lib/db";
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
  image: string[];
  attributeValueIds: string[];
}) {
  const product = await db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      oldPrice: data.oldPrice,
      stock: data.stock,
      badge: data.badge,
      categoryId: data.categoryId,
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

  return product;
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
    image,
    attributeValueIds = [],
  } = data;

  // Start a transaction to update product and attributes together
  return db.$transaction(async (tx) => {
    // Update main product fields
    const product = await tx.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        oldPrice,
        stock,
        badge,
        categoryId,
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

    return product;
  });
}

// Delete Product
export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
