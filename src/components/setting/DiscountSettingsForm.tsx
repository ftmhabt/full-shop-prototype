"use client";

import { DiscountInput } from "@/types";
import { Discount, DiscountType } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDiscounts = async () => {
    const res = await fetch("/api/discounts");
    const data: Discount[] = await res.json();
    setDiscounts(data);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSave = async (formData: FormData) => {
    setLoading(true);
    try {
      // Convert FormData → DiscountInput safely
      const input: DiscountInput = {
        code: formData.get("code") as string,
        description: (formData.get("description") as string) || undefined,
        type: formData.get("type") as DiscountType,
        value: Number(formData.get("value")),
        isGlobal: formData.get("isGlobal") === "true",
        isFirstTimeBuyer: formData.get("isFirstTimeBuyer") === "true",
        startsAt: (formData.get("startsAt") as string) || null,
        expiresAt: (formData.get("expiresAt") as string) || null,
      };

      await fetch("/api/discounts", {
        method: "POST",
        body: JSON.stringify(input),
      });

      toast.success("تخفیف ثبت شد!");
      fetchDiscounts();
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت تخفیف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">مدیریت تخفیف‌ها</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(new FormData(e.currentTarget));
        }}
        className="flex flex-wrap gap-2 items-center border p-4 rounded-lg"
      >
        <Input name="code" placeholder="کد تخفیف" required />
        <Input name="description" placeholder="توضیح (اختیاری)" />
        <Select name="type" defaultValue="PERCENTAGE">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="نوع تخفیف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">درصدی</SelectItem>
            <SelectItem value="FIXED">مبلغ ثابت</SelectItem>
          </SelectContent>
        </Select>
        <Input name="value" type="number" placeholder="مقدار" required />
        <Input name="startsAt" type="date" />
        <Input name="expiresAt" type="date" />

        <Select name="isGlobal" defaultValue="false">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="عمومی؟" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">بله</SelectItem>
            <SelectItem value="false">خیر</SelectItem>
          </SelectContent>
        </Select>

        <Select name="isFirstTimeBuyer" defaultValue="false">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="برای خریدار اول؟" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">بله</SelectItem>
            <SelectItem value="false">خیر</SelectItem>
          </SelectContent>
        </Select>

        <Button disabled={loading} type="submit">
          {loading ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </form>

      <h3 className="font-semibold">تاریخچه تخفیف‌ها</h3>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">کد</th>
            <th>مقدار</th>
            <th>نوع</th>
            <th>شروع</th>
            <th>پایان</th>
            <th>وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d.id} className="text-center border-t">
              <td>{d.code}</td>
              <td>{d.value}</td>
              <td>{d.type}</td>
              <td>
                {d.startsAt ? new Date(d.startsAt).toLocaleDateString() : "-"}
              </td>
              <td>
                {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "-"}
              </td>
              <td>{d.isActive ? "فعال" : "غیرفعال"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
