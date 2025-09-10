import { UserForm } from "@/components/admin/UserForm";
import { UsersList } from "@/components/admin/UserList";
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
      <UserForm />
      <UsersList users={users} />
    </div>
  );
}
