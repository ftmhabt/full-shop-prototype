"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ConstantsForm() {
  const [brands, setBrands] = useState<string[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [maxFileSize, setMaxFileSize] = useState(2 * 1024 * 1024);
  const [markup, setMarkup] = useState(30);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings/constants");
      const data = await res.json();
      if (data) {
        setBrands(data.brands || []);
        setMaxFileSize(data.maxFileSize);
        setMarkup(data.markupPercent);
      }
    })();
  }, []);

  async function saveConstants() {
    await fetch("/api/settings/constants", {
      method: "PUT",
      body: JSON.stringify({
        brands,
        maxFileSize,
        markupPercent: markup,
      }),
    });
    toast.success("Constants updated!");
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="text-lg font-semibold">App Constants</h2>

      <div>
        <label>Brands</label>
        <div className="flex gap-2 flex-wrap">
          {brands.map((b, i) => (
            <span key={i} className="border px-2 py-1 rounded">
              {b}
            </span>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add brand"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
          />
          <Button
            onClick={() => {
              if (newBrand) setBrands([...brands, newBrand]);
              setNewBrand("");
            }}
          >
            Add
          </Button>
        </div>
      </div>

      <div>
        <label>Max File Size (MB)</label>
        <Input
          type="number"
          value={maxFileSize / (1024 * 1024)}
          onChange={(e) =>
            setMaxFileSize(parseInt(e.target.value) * 1024 * 1024)
          }
        />
      </div>

      <div>
        <label>Markup Percent</label>
        <Input
          type="number"
          value={markup}
          onChange={(e) => setMarkup(parseInt(e.target.value))}
        />
      </div>

      <Button onClick={saveConstants}>Save</Button>
    </div>
  );
}
