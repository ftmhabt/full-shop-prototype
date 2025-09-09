import { CategoriesList } from "@/components/admin/CategoriesList";
import { CreateCategoryDialog } from "@/components/admin/CreateCategoryDialog";
import { db } from "@/lib/db";

export default async function CategoriesPage() {
  const categories = await db.category.findMany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت دسته‌ها</h1>
        <CreateCategoryDialog />
      </div>
      <CategoriesList categories={categories} />
    </div>
  );
}
