"use client";

import {
  loginWithPassword,
  requestOtp,
  setPassword,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.message || "مشکلی پیش آمد");
      }
    });
  };

  const handleForgotPassword = () => {
    startTransition(async () => {
      try {
        toast.loading("در حال ارسال کد بازیابی...");
        const res = await requestOtp(phone);
        toast.dismiss();

        if (res?.status === "ERROR") {
          toast.error(res.message || "خطا در ارسال کد");
          return;
        }

        toast.success("کد بازیابی ارسال شد");
        setStep("otp");
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.message || "مشکل در ارسال کد");
      }
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
      </form>
      {phone && mode === "enter" && (
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-blue-600 underline w-full"
        >
          رمز عبور را فراموش کرده‌ام
        </button>
      )}
    </>
  );
};
