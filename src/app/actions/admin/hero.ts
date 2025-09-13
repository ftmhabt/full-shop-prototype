"use server";

import db from "@/lib/db";
import { HeroSlideFormValues } from "@/lib/validations";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export async function getHeroSlides() {
  return await db.heroSlide.findMany({ orderBy: { order: "asc" } });
}

export async function updateHeroSlidesOrder(
  slides: { id: string; order: number }[]
) {
  await db.$transaction(
    slides.map((s) =>
      db.heroSlide.update({
        where: { id: s.id },
        data: { order: s.order },
      })
    )
  );
}

export async function toggleHeroSlideActive(id: string, value: boolean) {
  await db.heroSlide.update({ where: { id }, data: { isActive: value } });
}

export async function deleteHeroSlide(id: string) {
  await db.heroSlide.delete({ where: { id } });
}
export async function updateHeroSlide(
  id: string,
  data: Partial<{
    title: string;
    subtitle: string | null;
    order: number;
    isActive: boolean;
    primaryButtonLabel?: string | null;
    primaryButtonUrl?: string | null;
    secondaryButtonLabel?: string | null;
    secondaryButtonUrl?: string | null;
    image?: string;
  }>,
  imageFile?: File
) {
  const imageUrl = imageFile ? await saveFile(imageFile) : data.image;

  const updateData = {
    title: data.title,
    subtitle: data.subtitle,
    order: data.order,
    isActive: data.isActive,
    primaryButtonLabel: data.primaryButtonLabel,
    primaryButtonUrl: data.primaryButtonUrl,
    secondaryButtonLabel: data.secondaryButtonLabel,
    secondaryButtonUrl: data.secondaryButtonUrl,
    image: imageUrl,
  };

  const updated = await db.heroSlide.update({
    where: { id },
    data: updateData,
  });

  return updated;
}

// helper function
async function saveFile(file: File) {
  const uploadsDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop();
  const fileName = `${randomUUID()}.${ext}`;
  const filePath = join(uploadsDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  writeFileSync(filePath, Buffer.from(arrayBuffer));

  return `/uploads/${fileName}`;
}

export async function createHeroSlide(
  data: Partial<HeroSlideFormValues>,
  imageFile?: File
) {
  const imageUrl = imageFile ? await saveFile(imageFile) : null;

  const newSlide = await db.heroSlide.create({
    data: {
      title: data.title!,
      subtitle: data.subtitle ?? null,
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
      primaryButtonLabel: data.primaryButtonLabel ?? null,
      primaryButtonUrl: data.primaryButtonUrl ?? null,
      secondaryButtonLabel: data.secondaryButtonLabel ?? null,
      secondaryButtonUrl: data.secondaryButtonUrl ?? null,
      image: imageUrl ?? "", // optional fallback
    },
  });

  return newSlide;
}
