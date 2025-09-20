import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "پنل مدیریت",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </ThemeProvider>
  );
}
