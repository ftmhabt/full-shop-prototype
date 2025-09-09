"use client";

import { createAttributeWithValues } from "@/app/actions/admin/attributes";
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

export function CreateAttributeDialog({ categoryId }: { categoryId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [values, setValues] = useState<string[]>([""]);

  const handleAddValue = () => setValues([...values, ""]);
  const handleChangeValue = (i: number, val: string) => {
    const newVals = [...values];
    newVals[i] = val;
    setValues(newVals);
  };

  const handleCreate = async () => {
    if (!name || !slug) return toast.error("نام و slug الزامی است");

    try {
      await createAttributeWithValues({
        name,
        slug,
        categoryId,
        values: values.filter((v) => v).map((v) => ({ value: v, slug: v })),
      });
      toast.success("ویژگی با موفقیت ایجاد شد");
      setOpen(false);
      setName("");
      setSlug("");
      setValues([""]);
    } catch (err: any) {
      toast.error(err.message || "خطا در ایجاد ویژگی");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ایجاد ویژگی جدید</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد ویژگی جدید</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="نام ویژگی"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="slug ویژگی"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">مقادیر</label>
            {values.map((v, i) => (
              <Input
                key={i}
                value={v}
                onChange={(e) => handleChangeValue(i, e.target.value)}
                placeholder={`مقدار ${i + 1}`}
              />
            ))}
            <Button variant="outline" size="sm" onClick={handleAddValue}>
              + افزودن مقدار
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>ایجاد</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
