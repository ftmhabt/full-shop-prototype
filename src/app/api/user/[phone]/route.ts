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
      Address: true,
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
      Address: {
        updateMany: {
          where: { userId: data.id }, // update the main address if you store full name etc.
          data: {
            fullName: data.fullName,
            phone: data.phone,
            // add other fields as needed
          },
        },
      },
      // Add password hashing if updating password
    },
  });

  return NextResponse.json(updatedUser);
}
