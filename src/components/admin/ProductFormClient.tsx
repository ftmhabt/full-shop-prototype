"use client";

import { createProduct } from "@/app/actions/admin/products";
import { ProductForm } from "./ProductForm";

export default function ProductFormClient() {
  async function handleSubmit(data: any) {
    const formData = new FormData();
    data.images.forEach((file: File) => formData.append("images", file));

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const uploaded = await res.json();

    await createProduct({ ...data, image: uploaded.files });
  }

  return <ProductForm onSubmit={handleSubmit} />;
}
