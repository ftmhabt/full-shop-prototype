"use server";

import { db } from "@/lib/db";

export async function getEditorStats() {
  const [posts, categories, tags, authors] = await Promise.all([
    db.blogPost.findMany(),
    db.blogCategory.findMany(),
    db.blogTag.findMany(),
    db.user.findMany({ where: { role: "EDITOR" } }),
  ]);

  return {
    totalPosts: posts.length,
    totalCategories: categories.length,
    totalTags: tags.length,
    recentPosts: posts.slice(-5).reverse(),
    totalAuthors: authors.length,
  };
}
