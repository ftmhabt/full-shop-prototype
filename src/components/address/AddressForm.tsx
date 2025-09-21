"use client";

import { createAddress } from "@/app/actions/addresses";
import { getCurrentUser } from "@/app/actions/user";
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
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface AddressFormProps {
  onClose?: () => void;
  isVisible?: boolean;
}

export default function AddressForm({
  onClose,
  isVisible = true,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressInput>({
    title: "",
    fullName: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressInput, string>>
  >({});
  const [cities, setCities] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadUserDefaults() {
      const user = await getCurrentUser();
      if (user) {
        setForm((f) => ({
          ...f,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          phone: user.phone || "",
        }));
      }
    }
    loadUserDefaults();
  }, []);

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
        await createAddress(form);
        toast.success("آدرس با موفقیت اضافه شد.");
        setForm({
          title: "",
          fullName: "",
          phone: "",
          province: "",
          city: "",
          address: "",
          postalCode: "",
        });
        onClose?.();
      } catch (err) {
        console.error(err);
        toast.error("خطا در افزودن آدرس.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="border p-4 rounded-2xl shadow space-y-3 my-4"
    >
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
          placeholder="شماره تماس گیرنده"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
        {renderError("phone")}
      </div>

      <div>
        <Select
          value={form.province}
          onValueChange={handleProvinceChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-full border rounded-md px-3 py-2 flex items-center justify-between flex-row-reverse">
            <SelectValue placeholder="انتخاب استان" />
          </SelectTrigger>
          <SelectContent
            dir="rtl"
            className="w-full shadow-lg rounded-md max-h-60 overflow-auto text-right"
          >
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
          disabled={!form.province || isPending}
        >
          <SelectTrigger className="w-full border rounded-md px-3 py-2 flex items-center justify-between flex-row-reverse">
            <SelectValue placeholder="انتخاب شهر" />
          </SelectTrigger>
          <SelectContent
            dir="rtl"
            className="w-full shadow-lg rounded-md max-h-60 overflow-auto"
          >
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
          ذخیره آدرس
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
