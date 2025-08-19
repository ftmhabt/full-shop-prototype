"use client";

import { requestOtp, verifyOtp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useTransition } from "react";
import { toast } from "react-hot-toast";

interface OtpFormProps {
  phone: string;
  code: string;
  setCode: (val: string) => void;
  setStep: (step: "phone" | "otp" | "password" | "done") => void;
  timer: number;
  canResend: boolean;
  resetTimer: () => void;
  setPasswordMode: (mode: "set" | "enter") => void;
}

export const OtpForm = ({
  phone,
  code,
  setCode,
  setStep,
  timer,
  canResend,
  resetTimer,
  setPasswordMode,
}: OtpFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        toast.loading("در حال بررسی کد...");
        await verifyOtp(phone, code);

        toast.dismiss();
        toast.success("کد با موفقیت تأیید شد");

        setPasswordMode("set");
        setStep("password");
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.message || "خطایی رخ داد، لطفاً دوباره تلاش کنید");
      }
    });
  };

  const handleResend = () => {
    resetTimer();
    startTransition(async () => {
      try {
        toast.loading("در حال ارسال مجدد کد...");
        const res = await requestOtp(phone);

        toast.dismiss();

        if (res.status === "ERROR") {
          toast.error(res.message || "خطا در ارسال کد");
          return;
        }

        toast.success("کد جدید ارسال شد");

        if (res.status === "PASSWORD") {
          setPasswordMode("set");
          setStep("password");
        } else {
          setStep("otp");
        }
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.message || "ارسال کد با مشکل مواجه شد");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {timer > 0
            ? `00:${timer.toString().padStart(2, "0")}`
            : "زمان تمام شد"}
        </span>
        <button
          type="button"
          className="text-blue-600 text-sm underline"
          onClick={() => setStep("phone")}
        >
          تغییر شماره
        </button>
      </div>
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="کد یکبار مصرف"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "در حال بررسی..." : "تأیید کد"}
      </Button>
      {canResend && (
        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          className="w-full"
          disabled={isPending}
        >
          ارسال مجدد کد
        </Button>
      )}
    </form>
  );
};
