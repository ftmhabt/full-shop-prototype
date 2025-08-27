"use client";

import { createAddress } from "@/app/actions/addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { provinces } from "@/lib/locations";
import { AddressInput, addressSchema } from "@/lib/validations";
import { useUser } from "@/store/useUser";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AddressFormProps {
  onSuccess?: () => void;
}

export default function AddressForm({ onSuccess }: AddressFormProps) {
  const userId = useUser((state) => state.userId);
  const [form, setForm] = useState<AddressInput>({
    title: "",
    fullName: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const [cities, setCities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleProvinceChange(value: string) {
    setForm((f) => ({ ...f, province: value, city: "" }));
    const selected = provinces.find((p) => p.province === value);
    setCities(selected?.cities || []);
  }

  function handleCityChange(value: string) {
    setForm((f) => ({ ...f, city: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const parsed = addressSchema.safeParse(form);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        toast.error("لطفا تمام فیلدها را به درستی پر کنید.");
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      startTransition(async () => {
        // فراخوانی سرور اکشن برای اضافه کردن آدرس

        await createAddress(userId || "", form);
        onSuccess?.();
        setForm({
          title: "",
          fullName: "",
          phone: "",
          province: "",
          city: "",
          address: "",
          postalCode: "",
        });
      });
    } catch (err) {
      console.error(err);
      toast.error("خطا در افزودن آدرس.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="border p-4 rounded shadow space-y-3 mt-4"
    >
      <Input
        placeholder="عنوان"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <Input
        placeholder="نام کامل گیرنده"
        value={form.fullName}
        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
      />
      {errors.fullName && (
        <p className="text-red-500 text-sm">{errors.fullName}</p>
      )}

      <Input
        placeholder="شماره تماس گیرنده"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

      {/* Dropdown استان */}
      <Select
        value={form.province}
        onValueChange={handleProvinceChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full border rounded-md px-3 py-2 bg-white flex items-center justify-between flex-row-reverse">
          <SelectValue placeholder="انتخاب استان" />
        </SelectTrigger>
        <SelectContent
          dir="rtl"
          className="w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto text-right"
        >
          {provinces.map((p) => (
            <SelectItem
              key={p.province}
              value={p.province}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-right"
            >
              {p.province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.province && (
        <p className="text-red-500 text-sm">{errors.province}</p>
      )}

      {/* Dropdown شهر */}
      <Select
        value={form.city}
        onValueChange={handleCityChange}
        disabled={!form.province || isPending}
      >
        <SelectTrigger className="w-full border rounded-md px-3 py-2 bg-white flex items-center justify-between flex-row-reverse">
          <SelectValue placeholder="انتخاب شهر" />
        </SelectTrigger>
        <SelectContent
          dir="rtl"
          className="w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
        >
          {cities.map((c) => (
            <SelectItem
              key={c}
              value={c}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-right"
            >
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

      <Input
        placeholder="آدرس دقیق"
        value={form.address}
        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
      />
      {errors.address && (
        <p className="text-red-500 text-sm">{errors.address}</p>
      )}

      <Input
        placeholder="کد پستی"
        value={form.postalCode}
        onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
      />
      {errors.postalCode && (
        <p className="text-red-500 text-sm">{errors.postalCode}</p>
      )}

      <Button type="submit">ذخیره آدرس</Button>
    </form>
  );
}
