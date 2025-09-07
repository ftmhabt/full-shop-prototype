import { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <title>پنل مدیریت</title>
      </head>
      <body className="bg-gray-50 font-sans">{children}</body>
    </html>
  );
}
