"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NewUsers({
  users,
}: {
  users: { id: string; displayName: string; phone: string; createdAt: Date }[];
}) {
  return (
    <Card className="col-span-2 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">کاربران جدید</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border-b last:border-0 py-2 text-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium">{u.displayName}</span>
                <span className="text-xs text-muted-foreground">{u.phone}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(u.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
