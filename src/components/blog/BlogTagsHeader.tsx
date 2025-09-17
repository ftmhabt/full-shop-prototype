"use client";

import { BlogTagDialog } from "./BlogTagDialog";

export function BlogTagsHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">مدیریت برچسب‌های مقالات</h1>
      <BlogTagDialog />
    </div>
  );
}
