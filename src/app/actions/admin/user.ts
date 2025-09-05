"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function adminLogin(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  // پیدا کردن کاربر
  const user = await db.user.findFirst({ where: { email } });
  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "ایمیل یا رمز اشتباه است" };
  }

  // چک کردن پسورد
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { success: false, message: "ایمیل یا رمز اشتباه است" };
  }

  // ساخت JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3 * 60 * 60 * 24, // 3 روز
  });

  return { success: true };
}
