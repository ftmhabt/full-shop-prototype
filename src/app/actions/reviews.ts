"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user";

export async function getReviews(productId: string) {
  return await db.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createReview({
  productId,
  content,
  rating,
}: {
  productId: string;
  content: string;
  rating: number;
}) {
  const user = await getCurrentUser();
  if (!user?.id) throw new Error("Unauthorized");

  await db.review.create({
    data: {
      productId,
      content,
      rating,
      userId: user.id,
    },
  });

  revalidatePath(`/product/${productId}`);
}
