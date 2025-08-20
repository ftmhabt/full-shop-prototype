"use client";

import {
  loginWithPassword,
  requestOtp,
  setPassword,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { passwordSchema, phoneSchema } from "@/lib/validations";
import { FormEvent, useTransition } from "react";
import { toast } from "react-hot-toast";

interface PasswordFormProps {
  phone: string;
  setStep: (step: "phone" | "otp" | "password" | "done") => void;
  mode: "set" | "enter";
}

export const PasswordForm = ({ phone, setStep, mode }: PasswordFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pass = form.get("password") as string;

    startTransition(async () => {
      try {
        passwordSchema.parse(pass);
        toast.loading(mode === "set" ? "در حال ثبت رمز..." : "در حال ورود...");

        const res =
          mode === "set"
            ? await setPassword(phone, pass)
            : await loginWithPassword(phone, pass);

        toast.dismiss();

        if (!res.success) {
          toast.error(res.message || "عملیات ناموفق بود");
          return;
        }

        if (res.status === "PASSWORD_UPDATED") {
          toast.success("رمز عبور تغییر کرد");
        } else {
          toast.success("ثبت‌نام موفقیت‌آمیز بود");
        }
        setStep("done");
      } catch (err: unknown) {
        toast.dismiss();
        toast.error(getErrorMessage(err) || "مشکلی پیش آمد");
      }
    });
  };

  const handleForgotPassword = async () => {
    try {
      phoneSchema.parse(phone);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "شماره موبایل معتبر نیست");
      return;
    }

    await toast.promise(requestOtp(phone), {
      loading: "در حال ارسال کد بازیابی...",
      success: (res) => {
        if (res?.status === "ERROR") {
          return res.message || "خطا در ارسال کد";
        }
        setStep("otp");
        return "کد بازیابی ارسال شد";
      },
      error: (err: unknown) => getErrorMessage(err) || "مشکل در ارسال کد",
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          name="password"
          placeholder={
            mode === "set" ? "انتخاب رمز عبور" : "رمز عبور خود را وارد کنید"
          }
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? mode === "set"
              ? "در حال ثبت..."
              : "در حال ورود..."
            : mode === "set"
            ? "ثبت رمز"
            : "ورود"}
        </Button>
        {phone && mode === "enter" && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 w-full"
          >
            رمز عبور را فراموش کرده‌ام، کد بازیابی ارسال کن
          </button>
        )}
      </form>
    </>
  );
};
