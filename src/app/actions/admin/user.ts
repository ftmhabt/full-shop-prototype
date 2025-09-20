"use server";

import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function adminLogin(email: string, password: string) {
  try {
    const user = await db.user.findFirst({ where: { email } });

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
      return { success: false, message: "ادمین یافت نشد یا دسترسی ندارد" };
    }

    console.log("Found user:", user);
    console.log("Password input:", password);

    const valid = await bcrypt.compare(password, user.password);
    console.log("Password valid?", valid);

    if (!valid) {
      return { success: false, message: "ایمیل یا رمز عبور اشتباه است" };
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true });

    return { success: true, message: "ورود موفقیت‌آمیز بود", user };
  } catch (err) {
    console.error("Admin login error:", err);
    return { success: false, message: "خطا در ورود به پنل ادمین" };
  }
}

export async function createUser(data: {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  phone: string;
  password: string;
  role: "USER" | "ADMIN" | "EDITOR";
}) {
  const hashedPassword = await hash(data.password, 12);

  await db.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  revalidatePath("/admin/users");
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN" | "EDITOR"
) {
  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}
