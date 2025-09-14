import "@/app/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "فروشگاه سیستم‌های حفاظتی",
  description: "دزدگیر اماکن، دوربین مداربسته، اعلام حریق و تجهیزات امنیتی",
};

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
