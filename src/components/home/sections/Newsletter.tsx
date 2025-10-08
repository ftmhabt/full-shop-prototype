import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="mt-12">
      <Card className="rounded-3xl">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-right">
          <div>
            <CardTitle>عضویت در خبرنامه</CardTitle>
            <CardDescription>
              برای اطلاع از تخفیف‌ها و محصولات جدید ایمیل خود را وارد کنید.
            </CardDescription>
          </div>

          <div className="flex w-full max-w-lg items-center gap-2">
            <Input dir="ltr" type="email" placeholder="you@example.com" />
            <Button className="shrink-0">ثبت</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
