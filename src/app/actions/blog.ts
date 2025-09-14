"use server";
import db from "@/lib/db";
import { z } from "zod";
import { getCurrentUser } from "./user";

export async function getBlogPosts() {
  return db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      author: { select: { displayName: true } },
    },
  });
}

const BlogPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export async function createBlogPost(data: unknown) {
  const user = await getCurrentUser();
  if (!user || !(user.role === "ADMIN" || user.role === "EDITOR")) {
    throw new Error("شما اجازه ایجاد پست ندارید.");
  }

  const parsed = BlogPostSchema.parse(data);

  const blogPost = await db.blogPost.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      content: parsed.content,
      excerpt: parsed.excerpt,
      categoryId: parsed.categoryId,
      authorId: user.id,
      tags: parsed.tagIds
        ? {
            connect: parsed.tagIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      tags: true,
      category: true,
    },
  });

  return blogPost;
}
