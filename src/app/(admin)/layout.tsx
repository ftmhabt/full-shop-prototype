import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <title>پنل مدیریت</title>
      </head>
      <body className="bg-gray-50 font-sans">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
