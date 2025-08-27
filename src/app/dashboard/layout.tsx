"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "پیشخوان" },
  { href: "/dashboard/orders", label: "سفارش ها" },
  { href: "/dashboard/downloads", label: "دانلود ها" },
  { href: "/dashboard/addresses", label: "آدرس" },
  { href: "/dashboard/payments", label: "روش های پرداخت" },
  { href: "/dashboard/account", label: "اطلاعات حساب کاربری" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <Card className="p-4 space-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          )}
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      <LogoutButton />
    </Card>
  );

  return (
    <div className="container mx-auto pb-6 min-h-1/2 self-start">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h1 className="text-xl font-bold">داشبورد</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle>منوی کاربری</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{SidebarContent}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="hidden md:block md:col-span-1">
          {SidebarContent}
        </aside>
        <main className="md:col-span-3">
          <Card className="p-6">{children}</Card>
        </main>
      </div>
    </div>
  );
}
