import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  step: "phone" | "otp" | "password" | "done";
}

export const StepIndicator = ({ step }: StepIndicatorProps) => {
  const steps = ["شماره موبایل", "تأیید کد", "رمز عبور"];

  return (
    <div className="flex justify-between mb-4">
      {steps.map((s, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1",
              (step === "phone" && i === 0) ||
                (step === "otp" && i === 1) ||
                (step === "password" && i === 2)
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            )}
          >
            {i + 1}
          </div>
          <span className="text-xs text-center">{s}</span>
        </div>
      ))}
    </div>
  );
};
