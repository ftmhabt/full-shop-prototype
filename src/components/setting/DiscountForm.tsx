"use client";

import {
  deleteDiscount,
  getDiscounts,
  saveDiscount,
  updateDiscountStatus,
} from "@/app/actions/admin/discount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

type DiscountType = "PERCENTAGE" | "FIXED";

interface Discount {
  id: string;
  code: string;
  description?: string | null;
  type: DiscountType;
  value: number;
  isActive: boolean;
  neverExpires: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DiscountForm() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [neverExpires, setNeverExpires] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ✅ Load discounts initially
  useEffect(() => {
    (async () => {
      const data = await getDiscounts();
      setDiscounts(data);
    })();
  }, []);

  // ✅ Handle Save
  const handleSave = (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveDiscount(formData);
        const updated = await getDiscounts();
        setDiscounts(updated);
        toast.success("تخفیف ذخیره شد");
      } catch (error) {
        console.error(error);
        toast.error("خطا در ذخیره تخفیف");
      }
    });
  };

  // ✅ Optimistic Active Toggle
  const toggleActive = (id: string, current: boolean) => {
    const prevDiscounts = [...discounts];
    const optimistic = discounts.map((d) =>
      d.id === id ? { ...d, isActive: !current } : d
    );
    setDiscounts(optimistic);

    startTransition(async () => {
      try {
        const res = await updateDiscountStatus(id, !current);
        if (!res?.success) throw new Error("failed");
        toast.success("وضعیت تخفیف تغییر کرد");
      } catch (error) {
        console.error(error);
        setDiscounts(prevDiscounts);
        toast.error("خطا در تغییر وضعیت تخفیف");
      }
    });
  };

  const handleDelete = (id: string) => {
    const prevDiscounts = [...discounts];
    // Optimistic update
    setDiscounts(discounts.filter((d) => d.id !== id));

    startTransition(async () => {
      try {
        const res = await deleteDiscount(id);
        if (!res?.success) throw new Error("Delete failed");
        toast.success("تخفیف حذف شد");
      } catch {
        setDiscounts(prevDiscounts); // rollback
        toast.error("خطا در حذف تخفیف");
      }
    });
  };

  return (
    <div className="space-y-8 p-4">
      {/* 🧾 Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>افزودن تخفیف جدید</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSave} className="space-y-4">
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

            <Input
              name="value"
              type="number"
              placeholder="مقدار"
              min="1"
              required
            />

            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="neverExpires"
                checked={neverExpires}
                onChange={(e) => setNeverExpires(e.target.checked)}
              />
              <span>بدون تاریخ انقضا</span>
            </div>

            {!neverExpires && (
              <Input name="expiresAt" type="date" placeholder="تاریخ پایان" />
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? "در حال ذخیره..." : "ذخیره"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 📋 Discount List */}
      <Card>
        <CardHeader>
          <CardTitle>لیست تخفیف‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {discounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              هنوز هیچ تخفیفی ثبت نشده است.
            </p>
          ) : (
            <div className="grid gap-3">
              {discounts.map((d) => (
                <Card key={d.id} className="border p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash className="text-destructive" />
                      </Button>
                    </div>
                    <div className="ml-auto">
                      <p className="font-semibold">{d.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {d.description || "بدون توضیح"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline">
                        {d.type === "PERCENTAGE"
                          ? `${d.value}%`
                          : `${d.value.toLocaleString()} تومان`}
                      </Badge>

                      <Badge variant="outline" className="w-16">
                        {d.neverExpires
                          ? "بی‌انقضا"
                          : d.expiresAt
                          ? new Date(d.expiresAt).toLocaleDateString("fa-IR")
                          : "-"}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={d.isActive}
                          onCheckedChange={() => toggleActive(d.id, d.isActive)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
