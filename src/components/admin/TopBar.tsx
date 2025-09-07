"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  toggleSidebar: () => void;
}

export function Topbar({ toggleSidebar }: TopbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login"); // Call logout action if needed
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-gray-200 flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </Button>
      <h1 className="text-lg font-semibold">داشبورد مدیریت</h1>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-1" />
        خروج
      </Button>
    </header>
  );
}
