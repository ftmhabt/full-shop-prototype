import { requestOtp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useTransition } from "react";

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
      const res = await requestOtp(phone);
      if (res?.status === "EXISTING") {
        setPasswordMode("enter");
        setStep("password");
      } else {
        setStep("otp");
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
