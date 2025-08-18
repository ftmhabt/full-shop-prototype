import { useEffect, useState } from "react";

export const useOtpTimer = (step: string, initialTime = 60) => {
  const [timer, setTimer] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step !== "otp") return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const resetTimer = () => {
    setTimer(initialTime);
    setCanResend(false);
  };

  return { timer, canResend, resetTimer };
};
