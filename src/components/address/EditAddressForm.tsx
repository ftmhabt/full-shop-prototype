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
import { Address } from "@/types";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface EditAddressFormProps {
  address: Address;
  onClose: () => void;
}

export default function EditAddressForm({
  address,
  onClose,
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

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressInput, string>>
  >({});
  const [cities, setCities] = useState<string[]>(
    provinces.find((p) => p.province === address.province)?.cities || []
  );

  const [isPending, startTransition] = useTransition();

  function handleProvinceChange(value: string) {
    setForm((f) => ({ ...f, province: value, city: "" }));
    const selected = provinces.find((p) => p.province === value);
    setCities(selected?.cities || []);
  }

  function renderError(field: keyof AddressInput) {
    if (!errors[field]) return null;
    return <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = addressSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof AddressInput, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && typeof field === "string" && field in form) {
          fieldErrors[field as keyof AddressInput] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    startTransition(async () => {
      try {
        await updateAddress(address.id, form);
        toast.success("آدرس با موفقیت ویرایش شد.");
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("خطا در ویرایش آدرس.");
      }
    });
  }

  return (
    <form dir="rtl" className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <Input
          placeholder="عنوان"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        {renderError("title")}
      </div>

      <div>
        <Input
          placeholder="نام کامل گیرنده"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        />
        {renderError("fullName")}
      </div>

      <div>
        <Input
          placeholder="شماره تماس"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
        {renderError("phone")}
      </div>

      <div>
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
        {renderError("province")}
      </div>

      <div>
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
        {renderError("city")}
      </div>

      <div>
        <Input
          placeholder="آدرس دقیق"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
        {renderError("address")}
      </div>

      <div>
        <Input
          placeholder="کد پستی"
          value={form.postalCode}
          onChange={(e) =>
            setForm((f) => ({ ...f, postalCode: e.target.value }))
          }
        />
        {renderError("postalCode")}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          ذخیره
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
