"use client";

import { getConstants, saveConstants } from "@/app/actions/admin/setting";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ConstantsForm() {
  const [brands, setBrands] = useState<string[]>([]);
  const [maxFileSize, setMaxFileSize] = useState(2 * 1024 * 1024);
  const [markup, setMarkup] = useState(30);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const data = await getConstants();
      if (data) {
        setBrands(data.brands || []);
        setMaxFileSize(data.maxFileSize);
        setMarkup(data.markupPercent);
      }
    })();
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      await saveConstants({
        brands,
        maxFileSize,
        markupPercent: markup,
      });
      toast.success("تنظیمات با موفقیت ذخیره شد!");
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="text-lg font-semibold">تنظیمات کلی</h2>

      <div className="flex gap-3">
        <label className="w-full text-nowrap">
          حداکثر اندازه فایل (مگابایت)
        </label>
        <Input
          className="w-40"
          type="number"
          value={maxFileSize / (1024 * 1024)}
          onChange={(e) =>
            setMaxFileSize(parseInt(e.target.value) * 1024 * 1024)
          }
        />
      </div>

      <div className="flex gap-3">
        <label className="w-full text-nowrap">درصد سود</label>
        <Input
          className="w-40"
          type="number"
          value={markup}
          onChange={(e) => setMarkup(parseInt(e.target.value))}
        />
      </div>

      <Button disabled={isPending} onClick={handleSave}>
        ذخیره
      </Button>
    </div>
  );
}
