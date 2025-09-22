"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSlugValidator } from "@/hooks/useSlugValidator";
import { Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";

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

interface AttributeRowProps {
  row: Attribute;
  onSave: (row: Attribute) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function AttributeRow({
  row,
  onSave,
  onDelete,
}: AttributeRowProps) {
  const [localRow, setLocalRow] = useState(row);
  const { isValid, errorMessage } = useSlugValidator(localRow.slug);

  // Update field locally & call save on blur / enter
  const handleChange = (field: keyof Attribute, value: string) => {
    setLocalRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleValueChange = (index: number, value: string) => {
    setLocalRow((prev) => ({
      ...prev,
      values: prev.values.map((v, i) =>
        i === index ? { ...v, value, slug: value } : v
      ),
    }));
  };

  const handleAddValue = () => {
    setLocalRow((prev) => ({
      ...prev,
      values: [...prev.values, { value: "", slug: "" }],
    }));
  };

  const handleDeleteValue = (index: number) => {
    setLocalRow((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
    // Immediately save after deletion
    onSave({
      ...localRow,
      values: localRow.values.filter((_, i) => i !== index),
    });
  };

  const saveRow = () => {
    if (!isValid) return;
    onSave(localRow);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-stretch md:gap-4">
      {/* Name & Slug */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1">
        <Input
          value={localRow.name}
          placeholder="نام ویژگی"
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={saveRow}
          onKeyDown={(e) => e.key === "Enter" && saveRow()}
          className="flex-1"
        />
        <div className="flex flex-col flex-1">
          <Input
            value={localRow.slug}
            placeholder="Slug ویژگی"
            onChange={(e) => handleChange("slug", e.target.value)}
            onBlur={saveRow}
            onKeyDown={(e) => e.key === "Enter" && saveRow()}
            className={isValid ? "" : "border-destructive"}
          />
          {!isValid && errorMessage && (
            <span className="text-destructive text-xs mt-1">
              {errorMessage}
            </span>
          )}
        </div>
      </div>

      {/* Values */}
      <div className="flex-1 space-y-2 mt-2 md:mt-0">
        {localRow.values.map((v, i) => (
          <div className="flex items-center gap-2" key={v.id || i}>
            <Input
              value={v.value}
              placeholder={`مقدار ${i + 1}`}
              onChange={(e) => handleValueChange(i, e.target.value)}
              onBlur={saveRow}
              onKeyDown={(e) => e.key === "Enter" && saveRow()}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteValue(i)}
            >
              <Trash />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={handleAddValue}>
          + افزودن مقدار جدید
        </Button>
      </div>

      {/* Delete Button */}
      <div className="flex flex-col justify-between gap-2 mt-2 md:mt-0 self-stretch">
        <ConfirmDialogButton
          buttonText={<Trash />}
          dialogTitle="حذف ویژگی"
          dialogDescription="آیا از حذف این ویژگی مطمئنید؟"
          onConfirm={() => onDelete(localRow.id)}
          variant="destructive"
          size="sm"
        />
      </div>
    </div>
  );
}
