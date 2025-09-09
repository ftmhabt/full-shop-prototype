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
import { useState } from "react";
import toast from "react-hot-toast";

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleCreate = async () => {
    if (!name || !slug) return toast.error("نام و slug الزامی است");

    try {
      await createCategory({ name, slug });
      toast.success("دسته با موفقیت ایجاد شد");
      setOpen(false);
      setName("");
      setSlug("");
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
            placeholder="نام دسته"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="slug دسته"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>ایجاد</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
