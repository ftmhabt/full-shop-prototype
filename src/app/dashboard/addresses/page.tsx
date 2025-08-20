import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddressesPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">آدرس‌ها</h2>
      <Card>
        <CardHeader>
          <CardTitle>آدرس پیش‌فرض</CardTitle>
        </CardHeader>
        <CardContent>
          <p>تهران، خیابان آزادی، پلاک ۱۲۳</p>
          <Button size="sm" className="mt-3">
            ویرایش
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
