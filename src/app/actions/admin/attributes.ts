"use server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAttribute(data: {
  name: string;
  slug: string;
  categoryId: string;
}) {
  const attribute = await db.attribute.create({ data });
  revalidatePath(`/admin/categories/${data.categoryId}/attributes`);
  return attribute;
}

export async function deleteAttribute(id: string, categoryId: string) {
  await db.attribute.delete({ where: { id } });
  revalidatePath(`/admin/categories/${categoryId}/attributes`);
}

//--------------------------------------------------------------------

export async function createAttributeWithValues(data: {
  name: string;
  slug: string;
  categoryId: string;
  values?: { value: string; slug: string }[];
}) {
  const attribute = await db.attribute.create({
    data: {
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId,
      values: data.values
        ? {
            create: data.values.map((v) => ({
              value: v.value,
              slug: v.slug,
            })),
          }
        : undefined,
    },
    include: { values: true },
  });

  revalidatePath(`/admin/categories/${data.categoryId}/attributes`);
  return attribute;
}

export async function updateAttributeWithValues(data: {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  values: { id?: string; value: string; slug: string }[];
}) {
  // آپدیت attribute
  const updated = await db.attribute.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: data.slug,
    },
  });

  // حذف مقادیر قدیمی که توی لیست جدید نیستن
  const existing = await db.attributeValue.findMany({
    where: { attributeId: data.id },
  });
  const toDelete = existing.filter(
    (ev) => !data.values.some((v) => v.id === ev.id)
  );
  await db.attributeValue.deleteMany({
    where: { id: { in: toDelete.map((ev) => ev.id) } },
  });

  // upsert برای بقیه مقادیر
  for (const v of data.values) {
    if (v.id) {
      await db.attributeValue.update({
        where: { id: v.id },
        data: { value: v.value, slug: v.slug },
      });
    } else {
      await db.attributeValue.create({
        data: { value: v.value, slug: v.slug, attributeId: data.id },
      });
    }
  }

  revalidatePath(`/admin/categories/${data.categoryId}/attributes`);
  return updated;
}

export async function deleteAttributeWithValues(
  id: string,
  categoryId: string
) {
  await db.attributeValue.deleteMany({ where: { attributeId: id } });
  await db.attribute.delete({ where: { id } });
  revalidatePath(`/admin/categories/${categoryId}/attributes`);
}
