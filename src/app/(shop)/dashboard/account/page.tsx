import AccountForm from "@/components/account/AccountForm";
import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <p>لطفا ابتدا وارد شوید</p>;

  const userFromDb = await db.user.findUnique({
    where: { id: userId },
  });

  if (!userFromDb) return <p>کاربر یافت نشد</p>;

  const user = {
    id: userFromDb.id,
    phone: userFromDb.phone,
    firstName: userFromDb.firstName ?? undefined,
    lastName: userFromDb.lastName ?? undefined,
    displayName: userFromDb.displayName ?? undefined,
    email: userFromDb.email ?? undefined,
  };

  return <AccountForm user={user} />;
}
