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
  // tagIds: z.array(z.string()).optional(),
  tags: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        slug: z.string().min(1),
      })
    )
    .optional(),
});

export async function createBlogPost(data: unknown) {
  const user = await getCurrentUser();
  if (!user || !(user.role === "ADMIN" || user.role === "EDITOR")) {
    throw new Error("شما اجازه ایجاد پست ندارید.");
  }

  const parsed = BlogPostSchema.parse(data);

  const tagsToConnect =
    parsed.tags?.map((tag) => ({
      where: tag.id ? { id: tag.id } : { slug: tag.slug },
      create: {
        name: tag.name,
        slug: tag.slug,
      },
    })) ?? [];

  return await db.blogPost.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      content: parsed.content,
      excerpt: parsed.excerpt,
      categoryId: parsed.categoryId,
      authorId: user.id,
      tags: {
        connectOrCreate: tagsToConnect,
      },
    },
    include: {
      tags: true,
      category: true,
    },
  });
}

export async function getBlogCategories() {
  try {
    const categories = await db.blogCategory.findMany();
    // Map the results to the { value, label } format required by react-select
    return categories.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  } catch (err) {
    console.error("Failed to fetch blog categories:", err);
    return [];
  }
}

export async function getBlogTags() {
  const tags = await db.blogTag.findMany({ orderBy: { name: "asc" } });
  return tags.map((t) => ({
    value: t.id,
    label: t.name,
    slug: t.slug,
  }));
}
