"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ShippingMethod {
  id: number;
  name: string;
  cost: number;
}

export default function ShippingMethodsForm() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [form, setForm] = useState({ name: "", cost: "" });

  async function fetchMethods() {
    const res = await fetch("/api/settings/shipping");
    const data = await res.json();
    setMethods(data);
  }

  async function addMethod() {
    if (!form.name || !form.cost) return;
    await fetch("/api/settings/shipping", {
      method: "POST",
      body: JSON.stringify({ name: form.name, cost: parseFloat(form.cost) }),
    });
    toast.success("Added!");
    setForm({ name: "", cost: "" });
    fetchMethods();
  }

  async function deleteMethod(id: number) {
    await fetch("/api/settings/shipping", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    toast.success("Deleted!");
    fetchMethods();
  }

  useEffect(() => {
    fetchMethods();
  }, []);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="text-lg font-semibold">Shipping Methods</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Cost"
          type="number"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />
        <Button onClick={addMethod}>Add</Button>
      </div>

      <ul className="space-y-2">
        {methods.map((m) => (
          <li
            key={m.id}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>
              {m.name} — ${m.cost}
            </span>
            <Button variant="destructive" onClick={() => deleteMethod(m.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
