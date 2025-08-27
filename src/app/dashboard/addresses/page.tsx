import AddressList from "@/componets/address/AddressList";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Address } from "@/types";

export default async function AddressesPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-xl font-bold">آدرس‌های من</h1>
        <p>ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  const addressesFromDb = await db.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const addresses: Address[] = addressesFromDb.map((addr) => ({
    ...addr,
    createdAt: addr.createdAt.toISOString(),
    updatedAt: addr.updatedAt.toISOString(),
  }));

  return <AddressList addresses={addresses} serverUserId={userId} />;
}
