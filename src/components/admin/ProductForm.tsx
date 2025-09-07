"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { useForm } from "react-hook-form";

type ProductFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
};

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const form = useForm({
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      oldPrice: 0,
      stock: 0,
      badge: "",
      categoryId: "",
      images: [],
      existingImages: initialData?.image || [],
    },
  });

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [existingImages, setExistingImages] = React.useState<string[]>(
    initialData?.image || []
  );

  const removeExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  return (
    <form
      onSubmit={form.handleSubmit((data) =>
        onSubmit({ ...data, images: selectedFiles, existingImages })
      )}
      className="space-y-4"
      encType="multipart/form-data"
    >
      <Input {...form.register("name")} placeholder="نام محصول" />
      <Input {...form.register("slug")} placeholder="Slug" />
      <Textarea {...form.register("description")} placeholder="توضیحات" />
      <Input
        {...form.register("price", { valueAsNumber: true })}
        type="number"
        placeholder="قیمت"
      />
      <Input
        {...form.register("oldPrice", { valueAsNumber: true })}
        type="number"
        placeholder="قیمت قدیمی"
      />
      <Input
        {...form.register("stock", { valueAsNumber: true })}
        type="number"
        placeholder="موجودی"
      />
      <Input {...form.register("badge")} placeholder="Badge (اختیاری)" />
      <Input {...form.register("categoryId")} placeholder="Category ID" />

      {/* Existing images */}
      <div className="flex flex-wrap gap-2">
        {existingImages.map((img) => (
          <div key={img} className="relative">
            <img
              src={img}
              alt="existing"
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => removeExistingImage(img)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* New images */}
      <input
        type="file"
        multiple
        onChange={(e) =>
          e.target.files && setSelectedFiles(Array.from(e.target.files))
        }
      />

      <Button type="submit">ذخیره</Button>
    </form>
  );
}
