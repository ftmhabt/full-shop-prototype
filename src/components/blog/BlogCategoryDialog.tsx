"use client";

import { getProductCategories } from "@/app/actions/admin/categories";
import { createBlogCategory, updateBlogCategory } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SlugField } from "./SlugInput";

interface BlogCategoryDialogProps {
  initialData?: { id: string; name: string; slug: string };
  triggerLabel?: string | ReactNode;
}

export function BlogCategoryDialog({
  initialData,
  triggerLabel,
}: BlogCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [productSlugs, setProductSlugs] = useState<string[]>([]);
  const isEditing = Boolean(initialData);

  // گرفتن لیست slug های دسته‌بندی محصول
  useEffect(() => {
    async function fetchSlugs() {
      try {
        const categories = await getProductCategories(); // باید از سرور برگردونه
        setProductSlugs(categories.map((c: { slug: string }) => c.slug));
      } catch (err: any) {
        toast.error("خطا در دریافت دسته‌بندی محصولات");
      }
    }
    if (open) fetchSlugs(); // فقط وقتی دیالوگ باز میشه
  }, [open]);

  const handleSubmit = async () => {
    if (!name || !slug) return toast.error("نام و اسلاگ الزامی است");

    try {
      if (isEditing) {
        await updateBlogCategory({ id: initialData!.id, name, slug });
        toast.success("دسته با موفقیت ویرایش شد");
      } else {
        await createBlogCategory({ name, slug });
        toast.success("دسته با موفقیت ایجاد شد");
        setName("");
        setSlug("");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "خطایی رخ داد");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "outline" : "default"}>
          {triggerLabel || (isEditing ? "ویرایش دسته" : "ایجاد دسته جدید")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "ویرایش دسته" : "ایجاد دسته جدید"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="نام دسته"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <SlugField
            value={slug}
            onChange={setSlug}
            productSlugs={productSlugs}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isEditing ? "ذخیره تغییرات" : "ایجاد"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
