"use client";

import { CreateCategoryDialog } from "@/components/admin/CreateCategoryDialog";

export function CategoriesHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">مدیریت دسته‌ها</h1>
      <CreateCategoryDialog />
    </div>
  );
}
