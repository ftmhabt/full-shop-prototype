"use client";
import { OtpForm } from "@/components/auth/OtpForm";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { PhoneForm } from "@/components/auth/PhoneForm";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { useOtpTimer } from "@/hooks/useOtpTimer";
import { useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [passwordMode, setPasswordMode] = useState<"set" | "enter">("enter");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [returnedCode, setReturnedCode] = useState<string | undefined>(
    undefined
  );
  const { timer, canResend, resetTimer } = useOtpTimer(step);

  return (
    <div className="w-sm p-6 space-y-6 border rounded-2xl shadow-lg bg-white">
      <StepIndicator step={step} />

      {step === "phone" && (
        <PhoneForm
          phone={phone}
          setPhone={setPhone}
          setStep={setStep}
          setReturnedCode={setReturnedCode}
          setPasswordMode={setPasswordMode}
        />
      )}
      {step === "otp" && (
        <OtpForm
          phone={phone}
          code={code}
          setCode={setCode}
          returnedCode={returnedCode}
          setReturnedCode={setReturnedCode}
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
    </div>
  );
}
