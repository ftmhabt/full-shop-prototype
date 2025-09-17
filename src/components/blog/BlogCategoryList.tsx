"use client";

import { deleteBlogCategory } from "@/app/actions/blog";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";
import { BlogCategoryDialog } from "./BlogCategoryDialog";

export function BlogCategoriesList({
  blogCategories,
}: {
  blogCategories: any[];
}) {
  const handleDelete = async (id: string) => {
    try {
      await deleteBlogCategory(id);
      toast.success("دسته حذف شد");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف دسته");
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {blogCategories.map((cat) => (
        <div
          key={cat.id}
          className="border rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-lg">{cat.name}</h3>
            <p className="text-sm text-muted-foreground">slug: {cat.slug}</p>
          </div>
          <div
            className={`flex justify-end gap-2 mt-4 ${
              cat.slug === "other" ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {cat.slug === "other" && (
              <p className="text-sm text-muted-foreground">
                این دسته پیش‌فرض است (برای پست‌هایی که دسته‌ای ندارند) و امکان
                ویرایش یا حذف آن وجود ندارد
              </p>
            )}
            <BlogCategoryDialog initialData={cat} triggerLabel={<Edit />} />
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
