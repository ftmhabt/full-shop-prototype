"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : "اعمال فیلتر"}
    </Button>
  );
}
