"use client";

import { CreditCard, Home, Package, Tags, Users, X } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
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
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 bg-opacity-30 z-20 md:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-30 top-0 right-0 h-full w-64 bg-white border-l border-gray-200 p-4 transform transition-transform
          ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 md:static md:block`}
      >
        <div className="mb-6 flex items-center justify-between md:justify-center">
          <h2 className="text-lg font-bold">پنل مدیریت</h2>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
