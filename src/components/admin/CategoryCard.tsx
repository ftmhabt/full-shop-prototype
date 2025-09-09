"use client";

import { deleteCategory } from "@/app/actions/admin/categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";

export function CategoryCard({ category }: { category: any }) {
  const handleDelete = async () => {
    try {
      await deleteCategory(category.id);
      toast.success("دسته با موفقیت حذف شد.");
    } catch (err: any) {
      toast.error(err.message || "خطایی رخ داد.");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{category.name}</h3>
        <p className="text-sm text-muted-foreground">slug: {category.slug}</p>
      </div>
      <div className="flex justify-between mt-4">
        <Link href={`/admin/categories/${category.id}/attributes`}>
          <Button size="sm">مدیریت ویژگی‌ها</Button>
        </Link>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          حذف
        </Button>
        <ConfirmDialogButton
          buttonText="حذف"
          dialogTitle="حذف دسته"
          dialogDescription="آیا از حذف این دسته مطمئنید؟"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
        />
      </div>
    </div>
  );
}
