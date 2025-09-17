"use client";

import { BlogCategoryDialog } from "./BlogCategoryDialog";

export function BlogCategoriesHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">مدیریت دسته‌های مقالات</h1>
      <BlogCategoryDialog />
    </div>
  );
}
