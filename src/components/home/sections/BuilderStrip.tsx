import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cog } from "lucide-react";
import Link from "next/link";

export default function BuilderStrip() {
  return (
    <section className="mt-6">
      <Card className="rounded-3xl border-dashed">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-primary hidden sm:block" />
              <h1 className="font-bold text-lg">
                دستگاه دلخواهت رو همینجا بساز
              </h1>
            </div>
            <p>
              از هر دسته، قطعه‌ی مناسب رو انتخاب کن و سیستم امنیتی اختصاصی خودت
              رو مونتاژ کن — سریع، ساده و با نمایش قیمت لحظه‌ای.
            </p>
          </div>

          <Link href="/builder">
            <Button className="rounded-full">شروع انتخاب قطعات</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
