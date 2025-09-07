import { deleteProduct, updateProduct } from "@/app/actions/admin/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await db.product.findUnique({ where: { id: params.id } });

  if (!product) return <p>محصول یافت نشد</p>;

  async function handleSubmit(data: any) {
    // Upload new images
    let uploadedPaths: string[] = [];
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      data.images.forEach((file: File) => formData.append("images", file));
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      uploadedPaths = result.files;
    }

    // Combine existing images + new uploaded
    const finalImages = [...(data.existingImages || []), ...uploadedPaths];

    await updateProduct(product?.id as string, {
      ...data,
      image: finalImages,
    });
  }

  async function handleDelete() {
    await deleteProduct(product?.id as string);
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">ویرایش محصول</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} />
      <Button variant="destructive" onClick={handleDelete} className="mt-4">
        حذف محصول
      </Button>
    </div>
  );
}
