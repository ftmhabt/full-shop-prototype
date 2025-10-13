"use client";

import { deleteProduct } from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";
import { FallbackImage } from "../FallbackImage";

export default function ProductsList({ products }: { products: any[] }) {
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
    <div className="space-y-6 p-4" dir="rtl">
      {/* --- Header Actions --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-right w-full sm:w-auto">
          مدیریت محصولات
        </h1>
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <Link href="/admin/products/create">
            <Button>ایجاد محصول جدید</Button>
          </Link>
        </div>
      </div>

      {/* --- Table View (Desktop) --- */}
      <div className="overflow-x-auto w-full border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">تصویر</TableHead>
              <TableHead className="text-right">نام محصول</TableHead>
              <TableHead className="text-right">قیمت (تومان)</TableHead>
              <TableHead className="text-right">موجودی</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {localProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="w-[100px]">
                  {product.image?.[0] ? (
                    <FallbackImage
                      src={product.image[0]}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover w-[60px] h-[60px]"
                    />
                  ) : (
                    <div className="w-[60px] h-[60px] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                      بدون تصویر
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.priceToman?.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <ConfirmDialogButton
                    buttonText={<Trash className="w-4 h-4 text-destructive" />}
                    dialogTitle="حذف محصول"
                    dialogDescription="آیا از حذف این محصول مطمئن هستید؟ این عملیات قابل بازگشت نیست."
                    onConfirm={() => handleDelete(product.id)}
                    size="sm"
                    variant={"ghost"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Mobile Cards --- */}
      <div className="grid gap-4 md:hidden">
        {localProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader className="flex items-center justify-between">
              <span className="font-semibold">{product.name}</span>
              <span className="text-sm text-gray-500">
                {product.priceToman?.toLocaleString()} تومان
              </span>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 text-sm">
              {product.image?.[0] && (
                <FallbackImage
                  src={product.image[0]}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="rounded-md w-full h-40 object-cover"
                />
              )}
              <p>📦 موجودی: {product.stock}</p>
            </CardContent>

            <CardFooter className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(product.id)}
              >
                ویرایش
              </Button>

              <ConfirmDialogButton
                buttonText={<Trash className="w-4 h-4" />}
                dialogTitle="حذف محصول"
                dialogDescription="آیا از حذف این محصول مطمئن هستید؟"
                onConfirm={() => handleDelete(product.id)}
                size="sm"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
