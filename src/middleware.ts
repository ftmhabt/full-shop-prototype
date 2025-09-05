import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/dashboard")) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  const role = token ? JSON.parse(atob(token.split(".")[1])).role : null;

  if (url.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (url.startsWith("/writer") && role !== "writer" && role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (url.startsWith("/dashboard") && role !== "user") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/writer/:path*", "/dashboard/:path*"],
};
