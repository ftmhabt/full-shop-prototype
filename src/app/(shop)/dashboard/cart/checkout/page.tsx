import { getUserAddresses } from "@/app/actions/addresses";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import { getCurrentUserId } from "@/lib/auth";

export default async function page() {
  const userId = await getCurrentUserId();
  if (!userId) return <p>کاربر وارد نشده است</p>;

  const addresses = await getUserAddresses(userId);
  const serializedAddresses = addresses.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <div>
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
        اگر پرداخت شما انجام نشد یا صفحه پرداخت بسته شد، نگران نباشید. سفارش شما
        در{" "}
        <a href="/orders" className="underline font-bold">
          صفحه سفارش‌ها
        </a>{" "}
        موجود است و می‌توانید دوباره پرداخت کنید.
      </div>
      <CheckoutStepper addresses={serializedAddresses} />
    </div>
  );
}
