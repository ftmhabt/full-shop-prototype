// app/admin/products/create/page.tsx
import CreateProductForm from "@/components/admin/CreateProductForm";
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

  return <CreateProductForm categories={categories} attributes={attributes} />;
}
