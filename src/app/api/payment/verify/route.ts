import { db } from "@/lib/db";
import { zarinpal } from "@/lib/zarinpal";
import { NextResponse } from "next/server";

async function saveOrder(orderId: string, refId: number) {
  const order = await db.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      paidAt: new Date(),
      trackingCode: `TRK-${refId}`,
    },
  });

  return order.trackingCode;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const Authority = searchParams.get("Authority");
  const Status = searchParams.get("Status");
  const orderId = searchParams.get("orderId");

  if (!Authority || !Status || !orderId) {
    return NextResponse.json({ success: false, error: "پارامترهای ناقص" });
  }

  if (Status !== "OK") {
    return NextResponse.redirect(`/dashboard/cart/checkout?error=cancelled`);
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order)
    return NextResponse.redirect(`/dashboard/cart/checkout?error=notfound`);

  const response = await zarinpal.PaymentVerification({
    Amount: order.finalPrice * 10, // حتماً مبلغ واقعی
    Authority,
  });

  if (response.status === 100) {
    // ذخیره پرداخت موفق
    await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        paidAt: new Date(),
        trackingCode: `TRK-${response.refId}`,
      },
    });

    // هدایت به صفحه موفقیت
    return NextResponse.redirect(
      `/dashboard/cart/checkout/success?trackingCode=TRK-${response.refId}`
    );
  } else {
    return NextResponse.redirect(`/dashboard/cart/checkout?error=failed`);
  }
}
