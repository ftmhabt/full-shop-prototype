"use client";

import {
  deleteAttributeWithValues,
  updateAttributeWithValues,
} from "@/app/actions/admin/attributes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";

// ----- Types -----
export interface AttributeValue {
  id?: string;
  value: string;
  slug: string;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  values: AttributeValue[];
}

interface AttributesListProps {
  attributes: Attribute[];
  categoryId: string;
}

// ----- Component -----
export function AttributesList({
  attributes,
  categoryId,
}: AttributesListProps) {
  const [rows, setRows] = useState<Attribute[]>(attributes);
  const [savingAll, setSavingAll] = useState(false);

  // تغییر Name / Slug
  const handleChange = (id: string, field: keyof Attribute, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // تغییر مقدار value
  const handleValueChange = (attrId: string, index: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === attrId
          ? {
              ...row,
              values: row.values.map((v, i) =>
                i === index ? { ...v, value, slug: value } : v
              ),
            }
          : row
      )
    );
  };

  // افزودن مقدار جدید
  const handleAddValue = (attrId: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === attrId
          ? {
              ...row,
              values: [...row.values, { id: undefined, value: "", slug: "" }],
            }
          : row
      )
    );
  };

  // ذخیره یک row (Autosave)
  const handleSave = async (
    row: Attribute,
    action: "save" | "deleteValue" = "save"
  ) => {
    try {
      await updateAttributeWithValues({
        id: row.id,
        name: row.name,
        slug: row.slug,
        categoryId,
        values: row.values.map((v) => ({
          id: v.id,
          value: v.value,
          slug: v.slug || v.value,
        })),
      });

      if (action === "save") {
        toast.success(`ویژگی "${row.name}" ذخیره شد`);
      } else if (action === "deleteValue") {
        toast.success(`مقدار از ویژگی "${row.name}" حذف و ذخیره شد`);
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
    }
  };

  // ذخیره همه
  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      for (const row of rows) {
        await handleSave(row);
      }
      toast.success("همه ویژگی‌ها ذخیره شدند");
    } catch (err: any) {
      toast.error("خطا در ذخیره همه");
    } finally {
      setSavingAll(false);
    }
  };

  // حذف یک row
  const handleDelete = async (id: string) => {
    try {
      await deleteAttributeWithValues(id, categoryId);
      toast.success("ویژگی حذف شد");
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف ویژگی");
    }
  };

  // حذف یک value
  const handleDeleteValue = (attrId: string, index: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === attrId
          ? {
              ...row,
              values: row.values.filter((_, i) => i !== index),
            }
          : row
      )
    );

    const row = rows.find((r) => r.id === attrId);
    if (row) {
      const updatedRow: Attribute = {
        ...row,
        values: row.values.filter((_, i) => i !== index),
      };
      handleSave(updatedRow, "deleteValue");
    }
  };

  return (
    <div className="space-y-4">
      {/* دسکتاپ: دکمه بالای جدول */}
      <div className="hidden md:flex justify-end">
        <Button onClick={handleSaveAll} disabled={savingAll}>
          {savingAll ? "در حال ذخیره..." : "ذخیره همه تغییرات"}
        </Button>
      </div>
      <div className="mb-[70px] sm:mb-0 space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="border rounded-lg p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-stretch md:gap-4 bg-white"
          >
            {/* Name / Slug */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1">
              <Input
                value={row.name}
                placeholder="نام ویژگی"
                onChange={(e) => handleChange(row.id, "name", e.target.value)}
                onBlur={() => handleSave(row)}
                onKeyDown={(e) => e.key === "Enter" && handleSave(row)}
                className="flex-1"
              />
              <Input
                value={row.slug}
                placeholder="Slug ویژگی"
                onChange={(e) => handleChange(row.id, "slug", e.target.value)}
                onBlur={() => handleSave(row)}
                onKeyDown={(e) => e.key === "Enter" && handleSave(row)}
                className="flex-1"
              />
            </div>
            <div className="block md:hidden border-b border-b-primary/40" />
            {/* مقادیر */}
            <div className="flex-1 space-y-2 mt-2 md:mt-0">
              {row.values.map((v, i) => (
                <div className="flex items-center gap-2" key={v.id || i}>
                  <Input
                    value={v.value}
                    placeholder={`مقدار ${i + 1}`}
                    onChange={(e) =>
                      handleValueChange(row.id, i, e.target.value)
                    }
                    onBlur={() => handleSave(row)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave(row)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteValue(row.id, i)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddValue(row.id)}
              >
                + افزودن مقدار جدید
              </Button>
            </div>

            {/* دکمه حذف */}
            <div className="flex flex-col justify-between gap-2 mt-2 md:mt-0 self-stretch">
              <ConfirmDialogButton
                buttonText={<Trash />}
                dialogTitle="حذف ویژگی"
                dialogDescription="آیا از حذف این ویژگی مطمئنید؟"
                onConfirm={() => handleDelete(row.id)}
                // className="min-h-[40px] sm:h-full"
                variant="destructive"
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>
      {/* موبایل: دکمه فیکس پایین صفحه */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t shadow md:hidden z-50">
        <Button className="w-full" onClick={handleSaveAll} disabled={savingAll}>
          {savingAll ? "در حال ذخیره..." : "ذخیره همه تغییرات"}
        </Button>
      </div>
    </div>
  );
}
