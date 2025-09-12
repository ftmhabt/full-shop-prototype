import { CategoriesHeader } from "@/components/admin/CategoriesHeader";
import { CategoriesList } from "@/components/admin/CategoriesList";
import { db } from "@/lib/db";

export default async function CategoriesPage() {
  const categories = await db.category.findMany();

  return (
    <div className="space-y-6">
      <CategoriesHeader />
      <CategoriesList categories={categories} />
    </div>
  );
}
