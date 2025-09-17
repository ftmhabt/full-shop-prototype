import { BlogCategoriesHeader } from "@/components/blog/BlogCategoryHeader";
import { BlogCategoriesList } from "@/components/blog/BlogCategoryList";
import { db } from "@/lib/db";

export default async function CategoriesPage() {
  const blogCategories = await db.blogCategory.findMany();

  return (
    <div className="space-y-6">
      <BlogCategoriesHeader />
      <BlogCategoriesList blogCategories={blogCategories} />
    </div>
  );
}
