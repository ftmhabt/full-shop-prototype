"use client";

import { createCategory, updateCategory } from "@/app/actions/admin/categories";
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
import { Edit } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { IconName } from "../home/CategorySection";

const IconPicker = dynamic(
  () => import("./IconPicker.tsx").then((mod) => mod.default),
  { ssr: false }
);

export function CategoryDialog({
  initialValues,
}: {
  initialValues?: { id: string; name: string; slug: string; icon: IconName };
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [icon, setIcon] = useState<IconName>(
    (initialValues?.icon as IconName) ?? "Box"
  );

  const { isValid, errorMessage } = useSlugValidator(slug);

  const handleCreate = async () => {
    if (!isValid) {
      return toast.error(errorMessage);
    }
    if (!name || !slug) return toast.error("نام و اسلاگ الزامی است");

    try {
      if (initialValues)
        await updateCategory(initialValues.id, { name, slug, icon });
      else await createCategory({ name, slug, icon });
      toast.success("دسته با موفقیت ایجاد شد");
      setOpen(false);
      setName("");
      setSlug("");
      setIcon("Box");
    } catch (err: any) {
      toast.error(err.message || "خطایی رخ داد");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{initialValues ? <Edit /> : "ایجاد دسته جدید"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "ویرایش دسته" : "ایجاد دسته جدید"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="اسلاگ"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <IconPicker value={icon} onChange={setIcon} />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>
            {initialValues ? "ویرایش" : "ایجاد"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
