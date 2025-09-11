"use server";

import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export interface UpdateUserProps {
  userId: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  oldPassword: string;
  newPassword?: string;
}

export async function updateUser(data: UpdateUserProps) {
  const { userId, oldPassword, newPassword, ...fields } = data;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("کاربر یافت نشد");

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) throw new Error("رمز عبور فعلی اشتباه است");

  const updateData: {
    phone?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    password?: string;
  } = {};

  if (fields.phone) updateData.phone = fields.phone;
  if (fields.firstName) updateData.firstName = fields.firstName;
  if (fields.lastName) updateData.lastName = fields.lastName;
  if (fields.displayName) updateData.displayName = fields.displayName;
  if (fields.email) updateData.email = fields.email;

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateData.password = hashedPassword;
  }

  return db.user.update({
    where: { id: userId },
    data: updateData,
  });
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return user;
}
