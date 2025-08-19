import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (err: unknown): string => {
  if (!err) return "خطای ناشناخته‌ای رخ داد";

  if (typeof err === "string") return err;

  if (err instanceof Error && typeof err.message === "string") {
    return err.message;
  }

  // @ts-expect-error - for cases like Axios or custom API errors
  if (err.response?.message) return err.response.message;

  // if error.message itself is an object { status, message }
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as any).message === "object" &&
    "message" in (err as any).message
  ) {
    return (err as any).message.message;
  }

  return "مشکلی پیش آمد، دوباره تلاش کنید";
};
