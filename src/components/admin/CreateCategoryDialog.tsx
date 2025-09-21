"use client";

import { createCategory } from "@/app/actions/admin/categories";
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
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { IconName } from "../home/CategorySection";

const IconPicker = dynamic(
  () => import("./IconPicker.tsx").then((mod) => mod.default),
  { ssr: false }
);

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const { isValid, errorMessage } = useSlugValidator(slug);
  const [icon, setIcon] = useState<IconName>("Box");

  const handleCreate = async () => {
    if (!isValid) {
      return toast.error(errorMessage);
    }
    if (!name || !slug) return toast.error("نام و اسلاگ الزامی است");

    try {
      await createCategory({ name, slug, icon });
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
        <Button>ایجاد دسته جدید</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد دسته جدید</DialogTitle>
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
          <Button onClick={handleCreate}>ایجاد</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
