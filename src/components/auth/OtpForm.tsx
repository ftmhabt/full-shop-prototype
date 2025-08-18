import { requestOtp, verifyOtp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useTransition } from "react";

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
      await verifyOtp(phone, code);

      setPasswordMode("set");
      setStep("password");
    });
  };

  const handleResend = () => {
    resetTimer();
    startTransition(async () => {
      const res = await requestOtp(phone);
      if (res.status === "PASSWORD") {
        setPasswordMode("set");
        setStep("password");
      } else {
        setStep("done");
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
        >
          ارسال مجدد کد
        </Button>
      )}
    </form>
  );
};
