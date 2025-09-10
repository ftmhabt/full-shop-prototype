"use client";
import "@/app/globals.css";
import { Sidebar } from "@/components/admin/SideBar";
import { Topbar } from "@/components/admin/TopBar";
import { ReactNode, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-auto flex flex-col">
        <Topbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
