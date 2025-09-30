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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IconName } from "../home/CategorySection";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const IconPicker = dynamic(
  () => import("./IconPicker.tsx").then((mod) => mod.default),
  { ssr: false }
);

export function CategoryDialog({
  initialValues,
}: {
  initialValues?: {
    id: string;
    name: string;
    slug: string;
    icon: IconName;
    inBundle: boolean;
  };
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [inBundle, setInBundle] = useState(initialValues?.inBundle ?? false);
  const [icon, setIcon] = useState<IconName>(
    (initialValues?.icon as IconName) ?? "Box"
  );

  const { isValid, errorMessage } = useSlugValidator(slug);
  useEffect(() => {
    if (open && initialValues) {
      setName(initialValues.name);
      setSlug(initialValues.slug);
      setIcon(initialValues.icon);
      setInBundle(initialValues.inBundle);
    } else if (open && !initialValues) {
      setName("");
      setSlug("");
      setIcon("Box");
      setInBundle(false);
    }
  }, [open, initialValues]);
  const handleCreate = async () => {
    if (!isValid) {
      return toast.error(errorMessage);
    }
    if (!name || !slug) return toast.error("نام و اسلاگ الزامی است");

    try {
      if (initialValues)
        await updateCategory(initialValues.id, { name, slug, icon, inBundle });
      else await createCategory({ name, slug, icon, inBundle });
      toast.success("دسته با موفقیت ایجاد شد");
      setOpen(false);
      setName("");
      setSlug("");
      setIcon("Box");
      setInBundle(false);
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
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="airplane-mode">
              در بخش ساخت دستگاه سفارشی قرار گیرد؟
            </Label>
            <Switch
              checked={inBundle}
              onCheckedChange={setInBundle}
              id="airplane-mode"
            />
          </div>
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
