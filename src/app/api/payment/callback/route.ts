import { updateOrderStatus } from "@/app/actions/orders";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url); // اینجا origin رو هم داری
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const orderId = searchParams.get("orderId");

  if (!authority || !orderId) {
    return NextResponse.redirect(
      `${origin}/dashboard/payment/fail?orderId=${orderId}`
    );
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.redirect(
      `${origin}/dashboard/payment/fail?orderId=${orderId}`
    );
  }
  if (status === "OK") {
    const verify = await fetch(
      "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: order.finalPrice * 10,
          authority,
        }),
      }
    );

    const data = await verify.json();

    if (data.data && data.data.code === 100) {
      await updateOrderStatus(orderId, "PAID");

      return NextResponse.redirect(
        `${origin}/dashboard/payment/success?orderId=${orderId}&refId=${data.data.ref_id}`
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/dashboard/payment/fail?orderId=${orderId}`
  );
}
