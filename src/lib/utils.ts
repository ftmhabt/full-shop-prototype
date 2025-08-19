import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (err: unknown): string => {
  if (!err) return "خطای ناشناخته‌ای رخ داد";
  if (typeof err === "string") return err;

  // Zod error (جدید)
  if (err instanceof ZodError) {
    // flatten() خروجی flat شده با پیام‌ها
    return err.flatten().formErrors.join("\n") || "شماره موبایل معتبر نیست";
  }

  if ((err as any).response?.message) return (err as any).response.message;
  if ((err as any).message && typeof (err as any).message === "string")
    return (err as any).message;
  if ((err as any).message && typeof (err as any).message === "object")
    return (err as any).message.message;

  return "مشکلی پیش آمد، دوباره تلاش کنید";
};
