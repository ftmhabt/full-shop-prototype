import ProductForm from "@/components/admin/ProductForm";
import { db } from "@/lib/db";
import { usdToToman } from "@/lib/exchange";

export default async function EditPage({ params }: any) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { attributes: { include: { value: true } }, brand: true },
  });

  const categories = await db.category.findMany();
  const attributes = await db.attribute.findMany({ include: { values: true } });
  const priceInToman = await usdToToman(product?.price.toNumber() ?? 0);
  const brands = await db.brand.findMany({
    select: { id: true, name: true },
  });
  return (
    <ProductForm
      categories={categories}
      attributes={attributes}
      brands={brands}
      initialData={{
        id: product?.id || "",
        name: product?.name || "",
        slug: product?.slug || "",
        description: product?.description || "",
        price: priceInToman || 0,
        oldPrice: product?.oldPrice?.toNumber() || undefined,
        stock: product?.stock || 0,
        badge: product?.badge || undefined,
        categoryId: product?.categoryId || "",
        brandId: product?.brandId || "",
        images: product?.image || [],
        attributeValueIds: product?.attributes?.map((a) => a.valueId) || [],
      }}
    />
  );
}
