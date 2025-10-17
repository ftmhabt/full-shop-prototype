"use client";

import {
  addShippingMethod,
  deleteShippingMethod,
  getShippingMethods,
} from "@/app/actions/admin/setting";
import { formatPrice } from "@/lib/format";
import { ShippingMethod } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ShippingMethodsForm() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const data = await getShippingMethods();
      setMethods(data);
    })();
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("cost", cost);

    startTransition(async () => {
      await addShippingMethod(formData);
      const updated = await getShippingMethods();
      setMethods(updated);
      toast.success("افزوده شد!");
      setName("");
      setCost("");
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteShippingMethod(id);
      const updated = await getShippingMethods();
      setMethods(updated);
      toast.success("حذف شد!");
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="text-lg font-semibold">روش ارسال</h2>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="عنوان"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="هزینه"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <Button disabled={isPending} type="submit">
          <Plus />
        </Button>
      </form>

      <ul className="space-y-2">
        {methods.map((m) => (
          <li
            key={m.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span className="w-30 text-nowrap">{m.name}</span>
            <span>{formatPrice(m.cost)} تومن</span>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => handleDelete(m.id)}
            >
              <Trash />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
