import "@/app/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import CategoryNav from "@/components/server/CategoryNav";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClientWrapper categoryNav={<CategoryNav />}>{children}</ClientWrapper>
    </ThemeProvider>
  );
}
