"use client";

import { updateUserRole } from "@/app/actions/admin/user";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { UserForm } from "./UserForm";

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
    <div className="space-y-6 p-4" dir="rtl">
      {/* --- Header Actions --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-right w-full sm:w-auto">
          مدیریت کاربران
        </h1>
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <UserForm />
        </div>
      </div>

      {/* --- Table View (Desktop) --- */}
      <div className="overflow-x-auto w-full border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نام نمایشی</TableHead>
              <TableHead className="text-right">ایمیل</TableHead>
              <TableHead className="text-right">شماره تماس</TableHead>
              <TableHead className="text-right">نقش کاربر</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {localUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.displayName || "-"}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(v) =>
                      handleRoleChange(
                        user.id,
                        v as "USER" | "ADMIN" | "EDITOR"
                      )
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[150px]">
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
      </div>

      {/* --- Mobile Cards --- */}
      <div className="grid gap-4 md:hidden">
        {localUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex justify-between items-center">
              <span className="font-semibold">
                {user.displayName || "کاربر بدون نام"}
              </span>
              <span className="text-sm text-gray-500">
                {user.email || "بدون ایمیل"}
              </span>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <p>📞 {user.phone || "شماره تماس ثبت نشده"}</p>
              <p>
                🎭 نقش فعلی:{" "}
                {user.role === "ADMIN"
                  ? "ادمین"
                  : user.role === "EDITOR"
                  ? "نویسنده"
                  : "کاربر عادی"}
              </p>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Select
                value={user.role}
                onValueChange={(v) =>
                  handleRoleChange(user.id, v as "USER" | "ADMIN" | "EDITOR")
                }
                disabled={isPending}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">کاربر عادی</SelectItem>
                  <SelectItem value="ADMIN">ادمین</SelectItem>
                  <SelectItem value="EDITOR">نویسنده</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
