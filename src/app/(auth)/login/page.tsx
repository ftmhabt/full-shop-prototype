"use client";
import { OtpForm } from "@/components/auth/OtpForm";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { PhoneForm } from "@/components/auth/PhoneForm";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { useOtpTimer } from "@/hooks/useOtpTimer";
import { useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp" | "password" | "done">(
    "phone"
  );
  const [passwordMode, setPasswordMode] = useState<"set" | "enter">("enter");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const { timer, canResend, resetTimer } = useOtpTimer(step);

  return (
    <div className="w-sm p-6 space-y-6 border rounded-2xl shadow-lg bg-white">
      <StepIndicator step={step} />

      {step === "phone" && (
        <PhoneForm
          phone={phone}
          setPhone={setPhone}
          setStep={setStep}
          setPasswordMode={setPasswordMode}
        />
      )}
      {step === "otp" && (
        <OtpForm
          phone={phone}
          code={code}
          setCode={setCode}
          setStep={setStep}
          timer={timer}
          canResend={canResend}
          resetTimer={resetTimer}
          setPasswordMode={setPasswordMode}
        />
      )}
      {step === "password" && (
        <PasswordForm phone={phone} setStep={setStep} mode={passwordMode} />
      )}
      {step === "done" && (
        <p className="text-center font-semibold text-green-600 text-lg">
          🎉 خوش آمدید!
        </p>
      )}
    </div>
  );
}
