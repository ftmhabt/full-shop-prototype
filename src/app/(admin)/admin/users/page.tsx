import { UsersList } from "@/components/admin/UserList";
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <UsersList users={users} />;
}
