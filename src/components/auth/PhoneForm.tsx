"use client";

import { requestOtp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { FormEvent, useTransition } from "react";
import { toast } from "react-hot-toast";

interface PhoneFormProps {
  phone: string;
  setPhone: (val: string) => void;
  setStep: (step: "phone" | "otp" | "password" | "done") => void;
  setPasswordMode: (mode: "set" | "enter") => void;
}

export const PhoneForm = ({
  phone,
  setPhone,
  setStep,
  setPasswordMode,
}: PhoneFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        toast.loading("در حال ارسال کد...");
        const res = await requestOtp(phone);

        toast.dismiss();

        if (res?.status === "ERROR") {
          toast.error(getErrorMessage(res));
          return;
        }

        if (res?.status === "EXISTING") {
          toast.success("کاربر یافت شد");
          setPasswordMode("enter");
          setStep("password");
        } else {
          toast.success("کد ارسال شد");
          setStep("otp");
        }
      } catch (err: unknown) {
        toast.dismiss();
        toast.error(getErrorMessage(err));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="شماره موبایل"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "در حال بررسی..." : "ادامه"}
      </Button>
    </form>
  );
};
