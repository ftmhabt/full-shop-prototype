"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

// Schema
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
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateProductForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    },
  });

  // Handle file uploads
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      // Example API route: /api/upload
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      uploaded.push(data.url); // server should return { url }
    }

    const newImages = [...form.getValues("images"), ...uploaded];
    form.setValue("images", newImages);
    setPreviewImages(newImages);
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      await createProduct({
        name: values.name,
        slug: values.slug,
        description: values.description,
        price: values.price,
        oldPrice: values.oldPrice,
        stock: values.stock,
        badge: values.badge,
        categoryId: values.categoryId,
        image: values.images,
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
