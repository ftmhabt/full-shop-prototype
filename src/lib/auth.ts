import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string | null> {
  const allCookies = await cookies();
  const token = allCookies.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return payload.userId;
  } catch (err) {
    return "";
  }
}
