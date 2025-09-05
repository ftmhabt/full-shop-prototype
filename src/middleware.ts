import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const adminToken = req.cookies.get("admin_token")?.value;

  try {
    if (pathname.startsWith("/admin")) {
      // if (!adminToken) return NextResponse.redirect(new URL("/login", req.url));
      const { payload } = await jwtVerify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: payload.id as string },
      });
      if (!user || user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (pathname.startsWith("/editor")) {
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      const { payload } = await jwtVerify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: payload.id as string },
      });
      if (!user || (user.role !== "EDITOR" && user.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      const { payload } = await jwtVerify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: payload.id as string },
      });
      if (!user || user.role !== "USER") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*", "/dashboard/:path*"],
};
