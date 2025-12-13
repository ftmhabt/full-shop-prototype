'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();

  const handleThemeToggle = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleThemeToggle}
        className="p-2 rounded-full flex items-center justify-center transition-colors size-9 cursor-pointer dark:hidden"
        aria-label="Switch to dark mode"
      >
        <Moon className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        onClick={handleThemeToggle}
        className="p-2 rounded-full hidden dark:flex items-center justify-center transition-colors size-9 cursor-pointer"
        aria-label="Switch to light mode"
      >
        <Sun className="w-5 h-5" />
      </Button>
    </>
  );
}