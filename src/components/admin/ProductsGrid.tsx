"use client";

import { deleteProduct } from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ProductCard } from "./ProductCard";

export default function ProductsGrid({ products }: { products: any[] }) {
  const router = useRouter();
  const [localProducts, setLocalProducts] = React.useState(products);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف محصول مطمئن هستید؟")) return;
    await deleteProduct(id);
    setLocalProducts(localProducts.filter((p) => p.id !== id));
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">محصولات</h1>
        <Link href="/admin/products/create">
          <Button>ایجاد محصول جدید</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {localProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
