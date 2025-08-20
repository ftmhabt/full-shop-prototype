"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  return (
    <form className="space-y-4">
      <div>
        <Label>شماره موبایل</Label>
        <Input placeholder="98+9123456789" />
      </div>
      <div>
        <Label>نام</Label>
        <Input />
      </div>
      <div>
        <Label>نام خانوادگی</Label>
        <Input />
      </div>
      <div>
        <Label>نام نمایشی</Label>
        <Input />
        <p className="text-xs text-muted-foreground">
          به این صورت نام شما در حساب کاربری و نظرات دیده خواهد شد
        </p>
      </div>
      <div>
        <Label>آدرس ایمیل</Label>
        <Input type="email" value="alice@mail.com" readOnly />
      </div>
      <div>
        <Label>رمز عبور پیشین</Label>
        <Input type="password" />
      </div>
      <div>
        <Label>رمز عبور جدید</Label>
        <Input type="password" />
      </div>
      <div>
        <Label>تکرار رمز عبور</Label>
        <Input type="password" />
      </div>
      <Button type="submit">ذخیره تغییرات</Button>
    </form>
  );
}
