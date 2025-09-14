"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      variant={"ghost"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full flex items-center justify-center transition-colors"
    >
      {isDark ? <Moon className="w-5 h-5 " /> : <Sun className="w-5 h-5 " />}
    </Button>
  );
}
