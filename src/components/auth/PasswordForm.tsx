import {
  loginWithPassword,
  requestOtp,
  setPassword,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useTransition } from "react";
interface PasswordFormProps {
  phone: string;
  setStep: (step: "phone" | "otp" | "password" | "done") => void;
  mode: "set" | "enter"; // 👈 new prop
}

export const PasswordForm = ({ phone, setStep, mode }: PasswordFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const pass = form.get("password") as string;

    startTransition(async () => {
      if (mode === "set") {
        await setPassword(phone, pass);
        setStep("done");
      } else {
        await loginWithPassword(phone, pass);
        setStep("done");
      }
    });
  };

  const handleForgotPassword = () => {
    startTransition(async () => {
      await requestOtp(phone);
      setStep("otp");
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
      {phone && (
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
