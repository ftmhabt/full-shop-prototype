"use server";
import db from "@/lib/db";
import { BrandFormValues } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { saveFile } from "./admin/hero";

export async function deleteBrand(id: string) {
  await db.brand.delete({ where: { id } });
}

export async function getBrands() {
  return await db.brand.findMany();
}

export async function updateBrand(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    logo?: string;
  }>,
  imageFile?: File
) {
  const imageUrl = imageFile ? await saveFile(imageFile) : data.logo;
  const updateData = {
    name: data.name ?? "",
    slug: data.slug ?? "",
    logo: imageUrl,
  };

  await db.brand.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/setting");
}

export async function createBrand(
  data: Partial<BrandFormValues>,
  imageFile?: File
) {
  const imageUrl = imageFile ? await saveFile(imageFile) : null;

  await db.brand.create({
    data: {
      name: data.name ?? "",
      slug: data.slug ?? "",
      logo: imageUrl ?? "",
    },
  });
  revalidatePath("/admin/setting");
}
