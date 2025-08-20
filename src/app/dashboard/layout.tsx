import LogoutButton from "@/components/auth/LogoutButton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  return (
    <div className="container mx-auto grid grid-cols-4 gap-6 py-6">
      {/* Sidebar */}
      <aside className="col-span-1">
        <Card className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </Card>
      </aside>

      {/* Content */}
      <main className="col-span-3">
        <Card className="p-6">{children}</Card>
      </main>
    </div>
  );
}
