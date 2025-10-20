"use client";

import {
  deleteProduct,
  getPaginatedProducts,
} from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";
import { FallbackImage } from "../FallbackImage";

export default function ProductsList({
  initialProducts,
  initialPage,
  totalPages: initialTotalPages,
}: {
  initialProducts: any[];
  initialPage: number;
  totalPages: number;
}) {
  const [products, setProducts] = React.useState(initialProducts);
  const [page, setPage] = React.useState(initialPage);
  const [totalPages, setTotalPages] = React.useState(initialTotalPages);
  const [search, setSearch] = React.useState("");
  const [isPending, startTransition] = useTransition();

  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // 🔍 Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      startTransition(async () => {
        const { products, totalPages } = await getPaginatedProducts(1, value);
        setProducts(products);
        setTotalPages(totalPages);
        setPage(1);
      });
    }, 500);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("محصول با موفقیت حذف شد!");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(error?.message || "خطا در حذف محصول");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(async () => {
      const { products } = await getPaginatedProducts(newPage, search);
      setProducts(products);
      setPage(newPage);
    });
  };

  return (
    <div className="space-y-6 p-4" dir="rtl">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-right w-full sm:w-auto">
          مدیریت محصولات
        </h1>
        {/* --- Search Bar --- */}
        <div className="relative max-w-sm w-full">
          {isPending ? (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          )}

          <Input
            placeholder="جستجو در محصولات..."
            value={search}
            onChange={handleSearchChange}
            className="pr-9"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <Link href="/admin/products/create">
            <Button>ایجاد محصول جدید</Button>
          </Link>
        </div>
      </div>

      {/* --- Table View --- */}
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
            {products.map((product) => (
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
                  <Link href={"/admin/products/" + product.id}>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  <ConfirmDialogButton
                    buttonText={<Trash className="w-4 h-4 text-destructive" />}
                    dialogTitle="حذف محصول"
                    dialogDescription="آیا از حذف این محصول مطمئن هستید؟"
                    onConfirm={() => handleDelete(product.id)}
                    size="sm"
                    variant="ghost"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination Controls --- */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isPending}
          onClick={() => handlePageChange(page - 1)}
        >
          <ChevronRight className="w-4 h-4 ml-1" />
          قبلی
        </Button>

        <span className="text-sm font-medium">
          صفحه {page} از {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isPending}
          onClick={() => handlePageChange(page + 1)}
        >
          بعدی
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>

      {isPending && (
        <div className="text-center text-gray-500 text-sm mt-2">
          در حال بارگذاری...
        </div>
      )}
    </div>
  );
}
