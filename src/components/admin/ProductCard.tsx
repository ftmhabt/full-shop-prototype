"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";
import { FallbackImage } from "../FallbackImage";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      {product.image[0] && (
        <FallbackImage
          src={product.image[0]}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 flex flex-col justify-between h-40">
        <div>
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            قیمت: {product.price} تومان
          </p>
          <p className="text-sm text-muted-foreground">
            موجودی: {product.stock}
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <Button size="sm" onClick={() => onEdit(product.id)}>
            ویرایش
          </Button>
          <ConfirmDialogButton
            buttonText={<Trash color="white" />}
            dialogTitle="حذف محصول"
            dialogDescription="آیا از حذف این محصول مطمئن هستید؟ این عملیات قابل بازگشت نیست."
            onConfirm={() => onDelete(product.id)}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
