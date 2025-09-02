import { jwtVerify } from "jose";
import { User } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function UserIconLink() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let isLoggedIn = false;

  if (token) {
    try {
      await jwtVerify(token, secret);
      isLoggedIn = true;
    } catch {}
  }

  return (
    <Link
      href={isLoggedIn ? "/dashboard" : "/login"}
      className="flex items-center gap-1 text-sm text-primary"
    >
      <User className="h-4 w-4" />
    </Link>
  );
}
