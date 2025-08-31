import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "OrderId required" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only pending orders can be retried" },
      { status: 400 }
    );
  }

  const res = await fetch(
    "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: order.finalPrice * 10,
        description: `پرداخت سفارش #${order.id}`,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback?orderId=${order.id}`,
      }),
    }
  );

  const data = await res.json();

  if (data.data?.authority) {
    return NextResponse.json({
      url: `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`,
    });
  }

  return NextResponse.json(
    { error: data.errors?.message || "خطا در اتصال به زرین‌پال" },
    { status: 500 }
  );
}
