import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="py-10 space-y-6">
          <div className="text-7xl font-bold text-primary">404</div>
          <h2 className="text-2xl font-semibold">صفحه پیدا نشد</h2>
          <p className="text-muted-foreground">
            متأسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-md border border-primary text-primary"
            >
              بازگشت به صفحه اصلی
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-md bg-primary text-white"
            >
              رفتن به داشبورد
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
