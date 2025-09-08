import ProductForm from "@/components/admin/ProductForm";
import { db } from "@/lib/db";

export default async function EditPage({ params }: any) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { attributes: { include: { value: true } } },
  });

  const categories = await db.category.findMany();
  const attributes = await db.attribute.findMany({ include: { values: true } });

  return (
    <ProductForm
      categories={categories}
      attributes={attributes}
      initialData={{
        id: product?.id || "",
        name: product?.name || "",
        slug: product?.slug || "",
        description: product?.description || "",
        price: product?.price || 0,
        oldPrice: product?.oldPrice || undefined,
        stock: product?.stock || 0,
        badge: product?.badge || undefined,
        categoryId: product?.categoryId || "",
        images: product?.image || [],
        attributeValueIds: product?.attributes?.map((a) => a.valueId) || [],
      }}
    />
  );
}
