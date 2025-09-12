"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center"
      disabled={pending}
    >
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "اعمال فیلتر"}
    </button>
  );
}
