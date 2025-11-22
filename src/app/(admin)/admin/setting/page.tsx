import { getBrands } from "@/app/actions/brand";
import Brands from "@/components/setting/Brands";
import ConstantsForm from "@/components/setting/ConstantsForm";
import ShippingMethodsForm from "@/components/setting/ShippingMethodsForm";

export default async function SettingsPage() {
  const brands = await getBrands();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تنظیمات دیگر</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ShippingMethodsForm />
        <ConstantsForm />
        <Brands brands={brands} />
      </div>
    </div>
  );
}
