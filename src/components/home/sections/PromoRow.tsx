import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function PromoRow() {
  const promos = ["باشگاه مشتریان", "خرید عمده و پروژه", "ابزار و یراق"];

  return (
    <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {promos.map((title, i) => (
        <Card key={i} className="relative overflow-hidden rounded-3xl">
          <CardContent className="flex h-32 items-end justify-between p-6">
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>همین حالا اقدام کنید</CardDescription>
            </div>
            <Button size="sm" variant="secondary" className="rounded-full">
              ورود
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
