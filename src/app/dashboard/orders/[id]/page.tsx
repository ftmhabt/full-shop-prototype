import OrderDetailsClient from "@/components/order/OrderDetails";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("کاربر یافت نشد");

  // پیدا کردن سفارش
  const order = await db.order.findFirst({
    where: { id: params.id, userId },
    include: { items: true },
  });

  if (!order) {
    return <p className="text-center mt-10 text-red-500">سفارش یافت نشد.</p>;
  }

  // پاس دادن داده‌ها به Client Component
  return <OrderDetailsClient order={order} />;
}
