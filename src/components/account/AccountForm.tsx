"use client";

import { updateUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
}

interface FormState {
  phone: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  user: User;
}

export default function AccountForm({ user }: Props) {
  const [form, setForm] = useState<FormState>({
    phone: "",
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setForm({
      phone: user.phone,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      displayName: user.displayName || "",
      email: user.email || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.oldPassword) {
      toast.error("برای بروزرسانی اطلاعات، رمز عبور فعلی را وارد کنید");
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("رمز عبور جدید و تکرار آن یکسان نیست");
      return;
    }

    try {
      await updateUser({
        userId: user.id,
        phone: form.phone || undefined,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        displayName: form.displayName || undefined,
        email: form.email || undefined,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword || undefined,
      });
      toast.success("اطلاعات با موفقیت بروزرسانی شد");
      setForm((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("خطا در بروزرسانی اطلاعات");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label>شماره موبایل</Label>
        <Input name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div>
        <Label>نام</Label>
        <Input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>نام خانوادگی</Label>
        <Input name="lastName" value={form.lastName} onChange={handleChange} />
      </div>
      <div>
        <Label>نام نمایشی</Label>
        <Input
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>ایمیل</Label>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>رمز عبور فعلی</Label>
        <Input
          name="oldPassword"
          type="password"
          value={form.oldPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>رمز عبور جدید</Label>
        <Input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>تکرار رمز عبور</Label>
        <Input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">ذخیره تغییرات</Button>
    </form>
  );
}
