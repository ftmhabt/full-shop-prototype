"use client";

import { deleteCategory } from "@/app/actions/admin/categories";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";
import { DynamicIcon } from "../DynamicIcon";
import { CategoryDialog } from "./CreateCategoryDialog";

export function CategoriesList({ categories }: { categories: any[] }) {
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("دسته حذف شد");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف دسته");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="border rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex gap-2">
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <DynamicIcon iconName={cat.icon} className="text-primary/70" />
            </div>
            <p className="text-sm text-muted-foreground italic"> {cat.slug}</p>
          </div>

          <div className="flex justify-between mt-4 gap-2">
            <Link
              href={`/admin/categories/${cat.id}/attributes`}
              className="ml-auto"
            >
              <Button variant="outline" size="sm">
                مدیریت ویژگی‌ها
              </Button>
            </Link>
            <CategoryDialog initialValues={cat} />
            <ConfirmDialogButton
              buttonText={<Trash color="white" />}
              dialogTitle="حذف دسته"
              dialogDescription="آیا از حذف این دسته مطمئنید؟"
              onConfirm={() => handleDelete(cat.id)}
              variant="destructive"
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
