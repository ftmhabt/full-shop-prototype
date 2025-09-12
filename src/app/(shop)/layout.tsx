import "@/app/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه سیستم‌های حفاظتی",
  description: "دزدگیر اماکن، دوربین مداربسته، اعلام حریق و تجهیزات امنیتی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-background text-foreground">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
