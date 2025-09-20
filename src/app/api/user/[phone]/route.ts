import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const phone = pathname.split("/").pop();

  if (!phone) {
    return NextResponse.json({ error: "Phone not provided" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { phone },
    select: {
      phone: true,
      password: false,
      addresses: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const phone = pathname.split("/").pop();
  const data = await req.json();

  const updatedUser = await db.user.update({
    where: { phone },
    data: {
      addresses: {
        updateMany: {
          where: { userId: data.id },
          data: {
            fullName: data.fullName,
            phone: data.phone,
          },
        },
      },
    },
  });

  return NextResponse.json(updatedUser);
}
