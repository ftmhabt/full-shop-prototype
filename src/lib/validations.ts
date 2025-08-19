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
  .length(5, "کد OTP باید 5 رقم باشد")
  .regex(/^\d+$/, "کد OTP باید فقط عدد باشد");

// اعتبارسنجی پسورد
export const passwordSchema = z
  .string()
  .min(6, "پسورد حداقل 6 کاراکتر باشد")
  .max(30, "پسورد نمی‌تواند بیشتر از 30 کاراکتر باشد");
