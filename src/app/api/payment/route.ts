import { zarinpal } from "@/lib/zarinpal";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await zarinpal.PaymentRequest({
    Amount: 1000, // مبلغ (تومان)
    CallbackURL: "http://localhost:3000/api/payment/verify",
    Description: "خرید تستی با زرین پال",
    Email: "test@example.com",
    Mobile: "09123456789",
  });

  if (response.status === 100) {
    return NextResponse.redirect(response.url); // کاربر میره درگاه
  } else {
    return NextResponse.json({ error: response.status });
  }
}
