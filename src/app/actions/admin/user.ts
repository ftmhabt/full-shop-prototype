"use server";

import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function adminLogin(email: string, password: string) {
  try {
    const admin = await db.user.findFirst({ where: { email } });

    if (!admin || admin.role !== Role.ADMIN) {
      return { success: false, message: "ادمین یافت نشد یا دسترسی ندارد" };
    }

    console.log("Found admin:", admin);
    console.log("Password input:", password);
    const valid = await bcrypt.compare(password, admin.password);
    console.log("Password valid?", valid);
    if (!valid) {
      return { success: false, message: "ایمیل یا رمز عبور اشتباه است" };
    }

    const token = jwt.sign(
      { userId: admin.id, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const allCookies = await cookies();
    allCookies.set("token", token, { httpOnly: true });

    return { success: true, message: "ورود موفقیت‌آمیز بود", admin };
  } catch (err) {
    console.error("Admin login error:", err);
    return { success: false, message: "خطا در ورود به پنل ادمین" };
  }
}
