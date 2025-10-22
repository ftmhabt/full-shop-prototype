import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const discounts = await db.discount.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(discounts);
}

export async function POST(req: Request) {
  const data = await req.json();
  const {
    code,
    description,
    type,
    value,
    isGlobal,
    isFirstTimeBuyer,
    startsAt,
    expiresAt,
  } = data;

  const discount = await db.discount.create({
    data: {
      code,
      description,
      type,
      value: Number(value),
      isGlobal,
      isFirstTimeBuyer,
      startsAt: startsAt ? new Date(startsAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(discount);
}
