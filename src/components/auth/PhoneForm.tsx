"use client";

import { requestOtp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "react-hot-toast";

interface PhoneFormProps {
  phone: string;
  setPhone: (val: string) => void;
  setStep: (step: "phone" | "otp" | "password" | "done") => void;
  setPasswordMode: (mode: "set" | "enter") => void;
}

const iranPhoneRegex = /^(?:\+98|0)?9\d{9}$/;

export const PhoneForm = ({
  phone,
  setPhone,
  setStep,
  setPasswordMode,
}: PhoneFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [touched, setTouched] = useState(false);

  const isValid = iranPhoneRegex.test(phone);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    startTransition(async () => {
      const loadingToast = toast.loading("در حال ارسال کد...");
      try {
        const res = await requestOtp(phone);

        toast.dismiss(loadingToast);

        if (res?.status === "ERROR") {
          toast.error(res.message || "ثبت نام انجام نشد");
          return;
        }

        if (res?.status === "EXISTING") {
          setPasswordMode("enter");
          setStep("password");
          return;
        }

        setStep("otp");
        toast.success("کد ارسال شد");
      } catch (err: unknown) {
        toast.dismiss(loadingToast);
        toast.error(getErrorMessage(err) || "خطایی رخ داد");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setTouched(true);
        }}
        placeholder="شماره موبایل"
        disabled={isPending}
      />
      {touched && !isValid && (
        <p className="text-red-500 text-sm">شماره موبایل معتبر نیست</p>
      )}
      <Button type="submit" disabled={isPending || !isValid} className="w-full">
        {isPending ? "در حال بررسی..." : "ادامه"}
      </Button>
    </form>
  );
};
