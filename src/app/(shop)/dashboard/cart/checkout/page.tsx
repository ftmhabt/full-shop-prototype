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

  return <CheckoutStepper addresses={serializedAddresses} />;
}
