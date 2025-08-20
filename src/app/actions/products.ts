"use server";

import { db } from "@/lib/db";

export async function getProductsByCategorySlug(slug: string) {
  return db.product.findMany({
    where: { category: { slug } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCategories() {
  return db.category.findMany({
    orderBy: { name: "asc" },
  });
}
