import { z } from "zod";

// اعتبارسنجی شماره موبایل
export const phoneSchema = z
  .string()
  .min(11, "شماره موبایل باید 11 رقم باشد")
  .max(11, "شماره موبایل باید 11 رقم باشد")
  .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست");

// اعتبارسنجی OTP
export const otpSchema = z
  .string()
  .length(6, "کد OTP باید 6 رقم باشد")
  .regex(/^\d+$/, "کد OTP باید فقط عدد باشد");

// اعتبارسنجی پسورد
export const passwordSchema = z
  .string()
  .min(6, "پسورد حداقل 6 کاراکتر باشد")
  .max(30, "پسورد نمی‌تواند بیشتر از 30 کاراکتر باشد");

import { provinces } from "@/lib/locations";

export const addressSchema = z.object({
  title: z.string().min(2, "عنوان حداقل ۲ کاراکتر باشد").max(50),
  fullName: z.string().min(2, "نام کامل حداقل ۲ کاراکتر باشد").max(50),
  phone: z.string().regex(/^\d{10,11}$/, "شماره تلفن باید ۱۰ یا ۱۱ رقم باشد"),
  province: z.enum(provinces.map((p) => p.province) as [string, ...string[]]),
  city: z.string().min(2).max(50),
  address: z.string().min(10, "آدرس حداقل ۱۰ کاراکتر باشد"),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const heroSlideSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().min(0),
  isActive: z.boolean(),
  primaryButtonLabel: z.string().optional(),
  primaryButtonUrl: z.string().url().optional().or(z.literal("")),
  secondaryButtonLabel: z.string().optional(),
  secondaryButtonUrl: z.string().url().optional().or(z.literal("")),
  imageFile: z
    .any()
    .refine((files) => !files || files.length <= 1, "Only one file allowed")
    .optional(),
});

export type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;
