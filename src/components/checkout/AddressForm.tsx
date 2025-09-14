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
import { motion, useAnimation } from "framer-motion";
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

  const [cities, setCities] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      controls.start({
        opacity: 1,
        y: 0,
        height: "auto",
        transition: { duration: 0.25 },
      });
    }
  }, [isVisible, controls]);

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
  const handleProvinceChange = (value: string) => {
    setForm((f) => ({ ...f, province: value, city: "" }));
    const selected = provinces.find((p) => p.province === value);
    setCities(selected?.cities || []);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast.error("لطفا تمام فیلدها را به درستی پر کنید.");
      return;
    }

    startTransition(async () => {
      try {
        await createAddress(form); // سرور اکشن
        toast.success("آدرس با موفقیت اضافه شد.");
        onClose?.();
        setForm({
          title: "",
          fullName: "",
          phone: "",
          province: "",
          city: "",
          address: "",
          postalCode: "",
        });
      } catch (err) {
        console.error(err);
        toast.error("خطا در افزودن آدرس.");
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={controls}
      className="overflow-hidden w-full"
    >
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
        <Input
          placeholder="نام کامل گیرنده"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        />
        <Input
          placeholder="شماره تماس گیرنده"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />

        <Select
          value={form.province}
          onValueChange={handleProvinceChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-full border rounded-md px-3 py-2  flex items-center justify-between flex-row-reverse">
            <SelectValue placeholder="انتخاب استان" />
          </SelectTrigger>
          <SelectContent
            dir="rtl"
            className="w-full  shadow-lg rounded-md max-h-60 overflow-auto text-right"
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

        <Select
          value={form.city}
          onValueChange={(v) => setForm((f) => ({ ...f, city: v }))}
          disabled={!form.province || isPending}
        >
          <SelectTrigger className="w-full border rounded-md px-3 py-2  flex items-center justify-between flex-row-reverse">
            <SelectValue placeholder="انتخاب شهر" />
          </SelectTrigger>
          <SelectContent
            dir="rtl"
            className="w-full  shadow-lg rounded-md max-h-60 overflow-auto"
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

        <Input
          placeholder="آدرس دقیق"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
        <Input
          placeholder="کد پستی"
          value={form.postalCode}
          onChange={(e) =>
            setForm((f) => ({ ...f, postalCode: e.target.value }))
          }
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            ذخیره آدرس
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            انصراف
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
