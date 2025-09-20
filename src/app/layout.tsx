import "./globals.css";

export const metadata = {
  title: "My App",
  description: "Welcome to my app!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
