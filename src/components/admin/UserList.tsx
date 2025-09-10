"use client";

import { updateUserRole } from "@/app/actions/admin/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { useState, useTransition } from "react";

type UserWithRole = Prisma.UserGetPayload<{}>;

export function UsersList({ users }: { users: UserWithRole[] }) {
  const [localUsers, setLocalUsers] = useState(users);
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (
    userId: string,
    newRole: "USER" | "ADMIN" | "EDITOR"
  ) => {
    startTransition(async () => {
      await updateUserRole(userId, newRole);
      setLocalUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    });
  };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>نام</TableHead>
          <TableHead>نام خانوادگی</TableHead>
          <TableHead>نام نمایش</TableHead>
          <TableHead>ایمیل</TableHead>
          <TableHead>شماره تماس</TableHead>
          <TableHead>نقش</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {localUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.firstName || "-"}</TableCell>
            <TableCell>{user.lastName || "-"}</TableCell>
            <TableCell>{user.displayName || "-"}</TableCell>
            <TableCell>{user.email || "-"}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>
              <Select
                value={user.role}
                onValueChange={(v) => handleRoleChange(user.id, v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">کاربر عادی</SelectItem>
                  <SelectItem value="ADMIN">ادمین</SelectItem>
                  <SelectItem value="EDITOR">نویسنده</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
