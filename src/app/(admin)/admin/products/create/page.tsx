import CreateProductForm from "@/components/admin/CreateProductForm";
import { db } from "@/lib/db";

export default async function Page() {
  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });
  return <CreateProductForm categories={categories} />;
}
