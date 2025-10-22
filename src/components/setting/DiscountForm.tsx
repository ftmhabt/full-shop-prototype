"use client";

import { getDiscounts, saveDiscount } from "@/app/actions/admin/discount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function DiscountForm() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const data = await getDiscounts();
      setDiscounts(data);
    })();
  }, []);

  const handleSave = (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveDiscount(formData);
        const updated = await getDiscounts();
        setDiscounts(updated);
        toast.success("تخفیف ذخیره شد");
      } catch {
        toast.error("خطا در ذخیره تخفیف");
      }
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-md">
      <form action={handleSave} className="space-y-3">
        <Input name="code" placeholder="کد تخفیف" />
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

        <Input name="value" type="number" placeholder="مقدار" />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="neverExpires" value="true" /> بدون تاریخ
          انقضا
        </label>

        <Input
          name="expiresAt"
          type="date"
          placeholder="تاریخ پایان (در صورت وجود)"
        />

        <Button disabled={isPending} type="submit">
          ذخیره
        </Button>
      </form>

      <h3 className="font-semibold">لیست تخفیف‌ها</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr>
            <th>کد</th>
            <th>نوع</th>
            <th>مقدار</th>
            <th>انقضا</th>
            <th>فعال</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d.id}>
              <td>{d.code}</td>
              <td>{d.type}</td>
              <td>{d.value}</td>
              <td>
                {d.neverExpires
                  ? "بی‌انقضا"
                  : d.expiresAt
                  ? new Date(d.expiresAt).toLocaleDateString()
                  : "-"}
              </td>
              <td>{d.isActive ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
