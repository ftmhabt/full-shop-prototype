import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">روش‌های پرداخت</h2>
      <Card>
        <CardHeader>
          <CardTitle>کارت بانکی</CardTitle>
        </CardHeader>
        <CardContent>
          <p>۶۰۳۷-۹۹۷۱-۲۵۱۴-۷۸۹۰</p>
          <Button size="sm" className="mt-3">
            حذف
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
