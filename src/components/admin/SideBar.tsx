"use client";

import { getCurrentUserRole } from "@/app/actions/admin/getUserRole";
import {
  CreditCard,
  FileText,
  Home,
  Package,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [role, setRole] = useState<"ADMIN" | "EDITOR" | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const userRole = await getCurrentUserRole();
      setRole(userRole);
    }
    fetchRole();
  }, []);

  const navItems = [
    { label: "داشبورد", href: "/admin", icon: <Home className="w-4 h-4" /> },
    {
      label: "کاربران",
      href: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "سفارش‌ها",
      href: "/admin/orders",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: "محصولات",
      href: "/admin/products",
      icon: <Package className="w-4 h-4" />,
    },
    {
      label: "دسته‌بندی‌ها",
      href: "/admin/categories",
      icon: <Tags className="w-4 h-4" />,
    },
    {
      label: "اسلایدها",
      href: "/admin/hero-slides",
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: "وبلاگ",
      href: "/admin/blog",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const filteredNavItems =
    role === "EDITOR"
      ? navItems.filter(
          (item) => item.href === "/admin" || item.href === "/admin/blog"
        )
      : navItems;

  return (
    <aside
      className={`fixed z-30 top-0 right-0 h-full w-64 border-l p-4 transform transition-transform
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:static md:block bg-card md:bg-background`}
    >
      <div className="mb-6 flex items-center justify-between md:justify-center">
        <h2 className="text-lg font-bold">پنل مدیریت</h2>
        <button className="md:hidden" onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {!role ? (
        <p className="text-center text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <nav className="flex flex-col space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 p-2 rounded hover:bg-accent transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </aside>
  );
}
