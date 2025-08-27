import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>خوش آمدید!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>سلام کاربر عزیز، به حساب کاربری خود خوش آمدید 🎉</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>آخرین سفارش</CardTitle>
          </CardHeader>
          <CardContent>
            <p>سفارش شماره #1234 در حال پردازش است.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>موجودی کیف پول</CardTitle>
          </CardHeader>
          <CardContent>
            <p>۲۵۰٬۰۰۰ تومان</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
