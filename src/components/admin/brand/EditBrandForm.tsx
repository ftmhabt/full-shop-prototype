"use client";

import { createBrand, updateBrand } from "@/app/actions/brand";
import { FallbackImage } from "@/components/FallbackImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandFormValues, brandSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function EditBrandForm({
  brand,
  open,
  onClose,
  isNew = false,
}: {
  brand: BrandFormValues & { id?: string };
  open: boolean;
  onClose: () => void;
  isNew?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand.name ?? "",
      slug: brand.slug ?? "",
      imageFile: undefined,
    },
  });

  const file = form.watch("imageFile")?.[0];
  const fileTooLarge = file && file.size > 900 * 1024; // 900KB

  const onSubmit = (values: BrandFormValues) => {
    if (fileTooLarge) {
      toast.error("حجم فایل بیشتر از ۱ مگابایت است");
      return;
    }

    startTransition(async () => {
      try {
        const file = values.imageFile?.[0];

        if (isNew) {
          await createBrand(values, file);
          toast.success("New brand created");
        } else {
          await updateBrand(brand.id!, values, file);
          toast.success("Brand updated");
        }

        onClose();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save brand");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{brand?.id ? "ویرایش برند" : "ایجاد برند"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="name">نام برند</Label>
            <Input id="name" {...form.register("name")} />
          </div>
          {/* Slug */}
          <div>
            <Label htmlFor="slug">اسلاگ</Label>
            <Input id="slug" {...form.register("slug")} />
          </div>
          {/* Image */}
          <div>
            <Label>تصویر</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                {...form.register("imageFile")}
              />
              {/* Show current uploaded image if no new file is selected */}
              {!fileTooLarge &&
                !form.watch("imageFile")?.length &&
                brand.imageFile && (
                  <FallbackImage
                    src={brand.imageFile} // <-- use brand.imageFile directly
                    alt="Current brand image"
                    className="mt-2 h-24 w-auto rounded-md object-cover"
                    width="20"
                    height="20"
                  />
                )}
              {/* Show preview if a new file is selected */}
              {!fileTooLarge && form.watch("imageFile")?.length > 0 && (
                <FallbackImage
                  src={URL.createObjectURL(form.watch("imageFile")[0])}
                  alt="New image preview"
                  className="mt-2 h-24 w-auto rounded-md object-cover"
                  width="20"
                  height="20"
                />
              )}{" "}
            </div>
          </div>
          <p className="text-destructive">
            {fileTooLarge && "حجم تصویر نباید بزرگتر از 900 کیلوبایت باشد."}
          </p>

          <Button
            type="submit"
            disabled={isPending || fileTooLarge}
            className="w-full"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
