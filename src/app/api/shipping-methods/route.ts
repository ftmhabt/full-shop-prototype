import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const methods = await db.shippingMethod.findMany({
    where: { isActive: true },
    orderBy: { cost: "asc" },
  });
  return NextResponse.json(methods);
}
