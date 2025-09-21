"use client";

import { createBlogTag, updateBlogTag } from "@/app/actions/blog";
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
import { useSlugValidator } from "@/hooks/useSlugValidator";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

interface BlogCategoryDialogProps {
  initialData?: { id: string; name: string; slug: string };
  triggerLabel?: string | ReactNode;
}

export function BlogTagDialog({
  initialData,
  triggerLabel,
}: BlogCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const { isValid, errorMessage } = useSlugValidator(slug);

  const isEditing = Boolean(initialData);

  const handleSubmit = async () => {
    if (!isValid) {
      return toast.error(errorMessage);
    }
    if (!name || !slug) return toast.error("نام و اسلاگ الزامی است");

    try {
      if (isEditing) {
        await updateBlogTag({ id: initialData!.id, name, slug });
        toast.success("برچسب با موفقیت ویرایش شد");
      } else {
        await createBlogTag({ name, slug });
        toast.success("برچسب با موفقیت ایجاد شد");
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
          {triggerLabel || (isEditing ? "ویرایش برچسب" : "ایجاد برچسب جدید")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "ویرایش برچسب" : "ایجاد برچسب جدید"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="نام برچسب"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="اسلاگ برچسب"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={!isValid ? "border-destructive" : ""}
          />
          {errorMessage && (
            <span className="text-destructive text-sm">{errorMessage}</span>
          )}
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
