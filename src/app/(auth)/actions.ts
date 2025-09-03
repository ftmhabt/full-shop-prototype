"use server";

import { db } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";
import { getErrorMessage } from "@/lib/utils";
import { phoneSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requestOtp(phone: string) {
  const parsed = phoneSchema.safeParse(phone);
  if (!parsed.success) {
    return { status: "ERROR", message: getErrorMessage(parsed.error) };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await bcrypt.hash(code, 10);

  await db.otp.create({
    data: {
      phone,
      codeHash,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    },
  });

  const user = await db.user.findUnique({ where: { phone } });

  if (user) return { status: "EXISTING" };

  const smsResult = await sendOtpSms(phone, code);
  console.log(`DEBUG OTP for ${phone}:`, code);

  if (!smsResult.success) {
    return { status: "ERROR", message: smsResult.message, code };
  }

  return { status: "NEW" };
}

export async function verifyOtp(phone: string, code: string) {
  try {
    const otp = await db.otp.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return { success: false, message: "کدی برای این شماره یافت نشد" };
    }
    if (otp.expiresAt < new Date()) {
      return { success: false, message: "کد منقضی شده است" };
    }

    const valid = await bcrypt.compare(code, otp.codeHash);
    if (!valid) {
      return { success: false, message: "کد وارد شده صحیح نیست" };
    }

    await db.otp.delete({ where: { id: otp.id } });
    return { success: true, message: "کد معتبر است" };
  } catch (err: unknown) {
    return { success: false, message: getErrorMessage(err) || "خطایی رخ داد" };
  }
}
export async function setPassword(phone: string, password: string) {
  try {
    const hash = await bcrypt.hash(password, 10);

    let user = await db.user.findUnique({ where: { phone } });

    if (user) {
      user = await db.user.update({
        where: { phone },
        data: { password: hash },
      });
    } else {
      user = await db.user.create({
        data: { phone, role: "USER", password: hash },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const allCookies = await cookies();
    allCookies.set("token", token, { httpOnly: true });

    return {
      success: true,
      status: user ? "PASSWORD_UPDATED" : "SIGNED_UP",
      message: user
        ? "رمز عبور با موفقیت تغییر کرد"
        : "ثبت‌نام موفقیت‌آمیز بود",
      user,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: getErrorMessage(err) || "خطا در ثبت رمز عبور",
    };
  }
}

export async function loginWithPassword(phone: string, password: string) {
  try {
    const user = await db.user.findUnique({ where: { phone } });
    if (!user || !user.password) {
      return {
        success: false,
        message: "کاربر یافت نشد یا رمز عبور تنظیم نشده است",
      };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { success: false, message: "رمز عبور اشتباه است" };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const allCookies = await cookies();
    allCookies.set("token", token, { httpOnly: true });

    return {
      success: true,
      status: "LOGGED_IN",
      message: "ورود موفقیت‌آمیز بود",
      user,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: getErrorMessage(err) || "خطا در ورود به حساب کاربری",
    };
  }
}

export async function logout() {
  const allCookies = await cookies();
  allCookies.set("token", "", { httpOnly: true, expires: new Date(0) });

  redirect("/login");
}
