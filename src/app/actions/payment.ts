"use server";

import { AddressSnapshot } from "@/components/checkout/types";
import { CartItem } from "@/types";
import { createOrder } from "./orders";

export async function createOrderAndStartPayment(
  items: CartItem[],
  address: AddressSnapshot,
  discount: number = 0,
  shippingId: string,
  discountCode?: string
) {
  const order = await createOrder(
    items,
    address,
    discount,
    shippingId,
    discountCode
  );
  // درخواست به زرین‌پال
  const response = await fetch(
    "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID, // کلید در env
        amount: order.finalPrice * 10, // مبلغ به ریال باید ارسال شه
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback?orderId=${order.id}`,
        description: `پرداخت سفارش #${order.id}`,
      }),
    }
  );

  const data = await response.json();

  if (data.data && data.data.authority) {
    return `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`;
  } else {
    throw new Error(data.errors?.message || "خطا در اتصال به زرین‌پال");
  }
}
