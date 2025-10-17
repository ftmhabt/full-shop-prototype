import ProductForm from "@/components/admin/ProductForm";
import { db } from "@/lib/db";

export default async function Page() {
  const categories = await db.category.findMany({
    select: { id: true, name: true },
  });

  const attributes = await db.attribute.findMany({
    select: {
      id: true,
      name: true,
      categoryId: true,
      values: { select: { id: true, value: true } },
    },
  });
  const brands = await db.brand.findMany({
    select: { id: true, name: true },
  });
  return (
    <ProductForm
      categories={categories}
      attributes={attributes}
      brands={brands}
    />
  );
}
