"use server";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getCurrentUserRole() {
  const allCookies = await cookies();
  const token = allCookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role as "ADMIN" | "EDITOR";
  } catch {
    return null;
  }
}
