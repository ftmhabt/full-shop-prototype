"use client";

import { deleteProduct } from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import toast from "react-hot-toast";
import { ProductCard } from "./ProductCard";

export default function ProductsGrid({ products }: { products: any[] }) {
  const router = useRouter();
  const [localProducts, setLocalProducts] = React.useState(products);

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      await deleteProduct(id);
      toast.success("محصول با موفقیت حذف شد!");
      setLocalProducts(localProducts.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message ||
          "حذف محصول با مشکل مواجه شد. بررسی کنید آیا محصول در سفارش‌ها استفاده شده است."
      );
    }
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
