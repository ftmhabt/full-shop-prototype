"use client";

import { createUser } from "@/app/actions/admin/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";

export function UserForm() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN" | "EDITOR">("USER");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      await createUser({
        firstName,
        lastName,
        displayName,
        email,
        phone,
        password,
        role,
      });
      setOpen(false);
      // reset فرم
      setFirstName("");
      setLastName("");
      setDisplayName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("USER");
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>افزودن کاربر جدید</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md text-right">
          <DialogHeader>
            <DialogTitle>افزودن کاربر جدید</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 mt-2">
            <Input
              placeholder="نام"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="نام نمایش"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              placeholder="ایمیل"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="شماره تماس"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              placeholder="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="نقش کاربر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">کاربر عادی</SelectItem>
                <SelectItem value="ADMIN">ادمین</SelectItem>
                <SelectItem value="EDITOR">نویسنده</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              ثبت
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
