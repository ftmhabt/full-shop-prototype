"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "./user";

export async function getBlogPosts() {
  return db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tags: true,
      category: true,
      author: true,
    },
  });
}

export async function get4BlogPosts() {
  return db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: true,
    },
    take: 4,
  });
}

const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
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

  const categoryId = parsed.categoryId
    ? parsed.categoryId
    : (
        await db.blogCategory.upsert({
          where: { slug: "other" },
          update: {},
          create: {
            name: "سایر",
            slug: "other",
            description: "دسته‌بندی پیش‌فرض برای پست‌هایی بدون دسته‌بندی",
          },
        })
      ).id;

  const tagsToConnect =
    parsed.tags?.map((tag) => ({
      where: tag.id ? { id: tag.id } : { slug: tag.slug },
      create: {
        name: tag.name,
        slug: tag.slug,
      },
    })) ?? [];

  try {
    await db.blogPost.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        content: parsed.content,
        excerpt: parsed.excerpt,
        categoryId,
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
  } catch (error) {
    console.error("Failed to create blog post:", error);
  }
}

export async function updateBlogPost(data: unknown) {
  const user = await getCurrentUser();
  if (!user || !(user.role === "ADMIN" || user.role === "EDITOR")) {
    throw new Error("شما اجازه ویرایش پست ندارید.");
  }

  const parsed = BlogPostSchema.parse(data);

  const categoryId = parsed.categoryId ?? null;

  const tagsToConnect =
    parsed.tags?.map((tag) => ({
      where: tag.id ? { id: tag.id } : { slug: tag.slug },
      create: {
        name: tag.name,
        slug: tag.slug,
      },
    })) ?? [];

  try {
    await db.blogPost.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        categoryId,
        tags: {
          set: [], // clear old tags
          connectOrCreate: tagsToConnect,
        },
      },
      include: {
        tags: true,
        category: true,
      },
    });
  } catch (error) {
    console.error("Failed to update blog post:", error);
  }
}
export async function getBlogCategories() {
  try {
    const categories = await db.blogCategory.findMany();
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

export async function createBlogCategory(data: { name: string; slug: string }) {
  const category = await db.blogCategory.create({ data });
  revalidatePath("/admin/blog/blog-categories");
  return category;
}

export async function updateBlogCategory(data: {
  id: string;
  name: string;
  slug: string;
}) {
  const category = await db.blogCategory.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: data.slug,
    },
  });
  revalidatePath("/admin/blog/blog-categories");
  return category;
}

export async function deleteBlogCategory(id: string) {
  const postsCount = await db.blogPost.count({
    where: { categoryId: id },
  });

  if (postsCount > 0) {
    throw new Error(
      "نمی‌توانید این دسته‌بندی را حذف کنید چون حداقل یک مقاله به آن مرتبط است."
    );
  } else {
    await db.blogCategory.delete({
      where: { id },
    });
  }

  revalidatePath("/admin/blog/blog-categories");
}

export async function createBlogTag(data: { name: string; slug: string }) {
  const tag = await db.blogTag.create({ data });
  revalidatePath("/admin/blog/blog-tags");
  return tag;
}

export async function updateBlogTag(data: {
  id: string;
  name: string;
  slug: string;
}) {
  const tag = await db.blogTag.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: data.slug,
    },
  });
  revalidatePath("/admin/blog/blog-tags");
  return tag;
}

export async function deleteBlogTag(id: string) {
  await db.blogTag.delete({
    where: { id },
  });

  revalidatePath("/admin/blog/blog-tags");
}
