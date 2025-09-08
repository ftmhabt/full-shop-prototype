"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProduct } from "@/app/actions/admin/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().min(1),
  oldPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0),
  badge: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  mainImage: z.string().min(1, "Main image must be selected"),
  attributeValueIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProductForm({
  categories,
  attributes,
}: {
  categories: { id: string; name: string }[];
  attributes: {
    id: string;
    name: string;
    categoryId: string;
    values: { id: string; value: string }[];
  }[];
}) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      oldPrice: undefined,
      stock: 0,
      badge: "",
      categoryId: "",
      images: [],
      mainImage: "",
      attributeValueIds: [],
    },
  });

  const selectedAttributes = useMemo(() => {
    return attributes.filter((a) => a.categoryId === form.watch("categoryId"));
  }, [attributes, form.watch("categoryId")]);

  // Handle file uploads (multi-upload)
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("file", file); // 👈 چندتا فایل
    }

    // ارسال به API
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.urls) {
      const newImages = [...form.getValues("images"), ...data.urls];
      form.setValue("images", newImages);
      setPreviewImages(newImages);

      // اولین آپلود = main image پیش‌فرض
      if (!form.getValues("mainImage") && newImages.length > 0) {
        form.setValue("mainImage", newImages[0]);
        setMainImage(newImages[0]);
      }
    }
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      await createProduct({
        ...values,
        image: values.images,
        attributeValueIds: values.attributeValueIds || [],
      });

      router.push("/admin/products");
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Attribute Selector */}
          {selectedAttributes.length > 0 && (
            <div>
              <FormLabel>ویژگی‌ها</FormLabel>
              <div className="space-y-4 mt-2">
                {selectedAttributes.map((attr) => (
                  <div key={attr.id}>
                    <p className="font-medium mb-2">{attr.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val) => {
                        const selected = form
                          .watch("attributeValueIds")
                          ?.includes(val.id);
                        return (
                          <button
                            type="button"
                            key={val.id}
                            className={cn(
                              "px-3 py-1 rounded border",
                              selected ? "bg-primary text-white" : "bg-white"
                            )}
                            onClick={() => {
                              const current =
                                form.getValues("attributeValueIds") || [];
                              if (selected) {
                                form.setValue(
                                  "attributeValueIds",
                                  current.filter((v) => v !== val.id)
                                );
                              } else {
                                form.setValue("attributeValueIds", [
                                  ...current,
                                  val.id,
                                ]);
                              }
                            }}
                          >
                            {val.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Old Price */}
          <FormField
            control={form.control}
            name="oldPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Badge */}
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. New, Sale, Hot" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div>
            <FormLabel>Images</FormLabel>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="mt-2"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewImages.map((img) => (
                <Card
                  key={img}
                  className={cn(
                    "cursor-pointer relative overflow-hidden",
                    mainImage === img && "ring-2 ring-primary"
                  )}
                  onClick={() => {
                    setMainImage(img);
                    form.setValue("mainImage", img);

                    const currentImages = form.getValues("images");
                    const reordered = [
                      img,
                      ...currentImages.filter((i) => i !== img),
                    ];
                    form.setValue("images", reordered);
                    setPreviewImages(reordered);
                  }}
                >
                  <CardContent className="p-0">
                    <Image
                      src={img}
                      alt="preview"
                      width={200}
                      height={200}
                      className="object-cover w-full h-32"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <FormMessage />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
