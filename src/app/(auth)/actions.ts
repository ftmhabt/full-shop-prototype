"use server";

import { db } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function requestOtp(phone: string) {
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

  await sendOtpSms(phone, code);
  console.log(`DEBUG OTP for ${phone}:`, code);

  return { status: "NEW" };
}

export async function verifyOtp(phone: string, code: string) {
  const otp = await db.otp.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) throw new Error("OTP not found");
  if (otp.expiresAt < new Date()) throw new Error("OTP expired");

  const valid = await bcrypt.compare(code, otp.codeHash);
  if (!valid) throw new Error("Invalid code");

  await db.otp.delete({ where: { id: otp.id } });
}

export async function setPassword(phone: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { phone, role: "USER", password: hash },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  const allCookies = await cookies();
  allCookies.set("token", token, { httpOnly: true });

  return { status: "SIGNED_UP", user };
}

export async function loginWithPassword(phone: string, password: string) {
  const user = await db.user.findUnique({ where: { phone } });
  if (!user || !user.password) {
    throw new Error("User not found or password not set");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const allCookies = await cookies();
  allCookies.set("token", token, { httpOnly: true });

  return { status: "LOGGED_IN", user };
}
