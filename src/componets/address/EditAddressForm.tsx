"use client";

import { updateAddress } from "@/app/actions/addresses";
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
import { Address } from "@/types";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface EditAddressFormProps {
  address: Address;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditAddressForm({
  address,
  onCancel,
  onSuccess,
}: EditAddressFormProps) {
  const [form, setForm] = useState<AddressInput>({
    title: address.title,
    fullName: address.fullName,
    phone: address.phone,
    province: address.province,
    city: address.city,
    address: address.address,
    postalCode: address.postalCode || "",
  });

  const [cities, setCities] = useState<string[]>(
    provinces.find((p) => p.province === address.province)?.cities || []
  );

  const [isPending, startTransition] = useTransition();
  const userId = useUser((state) => state.userId);

  function handleProvinceChange(value: string) {
    setForm((f) => ({ ...f, province: value, city: "" }));
    const selected = provinces.find((p) => p.province === value);
    setCities(selected?.cities || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast.error("لطفا تمام فیلدها را به درستی پر کنید.");
      return;
    }

    startTransition(async () => {
      try {
        await updateAddress(address.id, userId || "", form);
        toast.success("آدرس با موفقیت ویرایش شد.");
        onSuccess();
      } catch (err) {
        console.error(err);
        toast.error("خطا در ویرایش آدرس.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="space-y-3">
      <Input
        placeholder="عنوان"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />
      <Input
        placeholder="نام کامل گیرنده"
        value={form.fullName}
        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
      />
      <Input
        placeholder="شماره تماس"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
      />

      <Select value={form.province} onValueChange={handleProvinceChange}>
        <SelectTrigger>
          <SelectValue placeholder="انتخاب استان" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {provinces.map((p) => (
            <SelectItem key={p.province} value={p.province}>
              {p.province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={form.city}
        onValueChange={(v) => setForm((f) => ({ ...f, city: v }))}
        disabled={!form.province}
      >
        <SelectTrigger>
          <SelectValue placeholder="انتخاب شهر" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="آدرس دقیق"
        value={form.address}
        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
      />

      <Input
        placeholder="کد پستی"
        value={form.postalCode}
        onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          ذخیره
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
