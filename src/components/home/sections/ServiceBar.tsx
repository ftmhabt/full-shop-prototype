import { CreditCard, Headphones, RefreshCw, Truck } from "lucide-react";
import FeatureItem from "./FeatureItem";

const items = [
  {
    icon: <Headphones className="h-5 w-5" />,
    t: "پشتیبانی ۲۴ ساعته",
    d: "مشاوره قبل و بعد از خرید",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    t: "پرداخت امن",
    d: "درگاه‌ های رسمی بانکی",
  },
  { icon: <Truck className="h-5 w-5" />, t: "ارسال سریع", d: "به سراسر ایران" },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    t: "ضمانت اصالت کالا",
    d: "مهلت تست و بازگشت",
  },
];

export default function ServiceBar() {
  return (
    <section className="mt-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((i, idx) => (
          <FeatureItem key={idx} icon={i.icon} title={i.t} desc={i.d} />
        ))}
      </div>
    </section>
  );
}
