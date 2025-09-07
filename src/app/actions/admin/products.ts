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
  image: string[]; // array of local paths after upload
}) {
  const product = await db.product.create({
    data: {
      ...data,
      image: data.image,
    },
  });

  revalidatePath("/admin/products");
  return product;
}

// Update Product
export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    oldPrice?: number;
    stock: number;
    badge?: string;
    categoryId: string;
    image?: string[];
  }>
) {
  const product = await db.product.update({
    where: { id },
    data: {
      ...data,
      ...(data.image ? { image: data.image } : {}),
    },
  });

  revalidatePath("/admin/products");
  return product;
}

// Delete Product
export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
