import ConstantsForm from "@/components/setting/ConstantsForm";
import DiscountManager from "@/components/setting/DiscountSettingsForm";
import ShippingMethodsForm from "@/components/setting/ShippingMethodsForm";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تنظیمات دیگر</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ShippingMethodsForm />
        <ConstantsForm />
        <DiscountManager />
      </div>
    </div>
  );
}
