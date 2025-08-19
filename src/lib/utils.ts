import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (err: any): string => {
  if (!err) return "خطای ناشناخته‌ای رخ داد";
  if (typeof err === "string") return err;
  if (err.message && typeof err.message === "string") return err.message;
  if (err.response?.message) return err.response.message; // برای APIهایی مثل SMS.ir
  if (err.message && typeof err.message === "object")
    return err.message.message; // مثل {"status":104,"message":"..."}
  return "مشکلی پیش آمد، دوباره تلاش کنید";
};
