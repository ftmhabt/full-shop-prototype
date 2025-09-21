"use client";

import { CategoryDialog } from "./CreateCategoryDialog";

export function CategoriesHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">مدیریت دسته‌ها</h1>
      <CategoryDialog />
    </div>
  );
}
