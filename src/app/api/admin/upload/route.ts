import { randomUUID } from "crypto";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "هیچ فایلی ارسال نشده" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `فرمت ${file.name} مجاز نیست` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `حجم ${file.name} بیشتر از ۲ مگابایت است` },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name) || ".png";
      const fileName = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      urls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "آپلود با خطا مواجه شد" },
      { status: 500 }
    );
  }
}
