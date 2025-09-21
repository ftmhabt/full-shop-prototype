import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSlugValidator } from "@/hooks/useSlugValidator";
import { Trash } from "lucide-react";
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
  onChange: (id: string, field: keyof Attribute, value: string) => void;
  onSave: (row: Attribute) => Promise<void>;
  onValueChange: (attrId: string, index: number, value: string) => void;
  onAddValue: (attrId: string) => void;
  onDelete: (id: string) => void;
  onDeleteValue: (attrId: string, index: number) => void;
}

export default function AttributeRow({
  row,
  onChange,
  onSave,
  onValueChange,
  onAddValue,
  onDelete,
  onDeleteValue,
}: AttributeRowProps) {
  const { isValid, errorMessage } = useSlugValidator(row.slug);

  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-3 md:space-y-0 md:flex md:items-stretch md:gap-4">
      {/* Name / Slug */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1">
        <Input
          value={row.name}
          placeholder="نام ویژگی"
          onChange={(e) => onChange(row.id, "name", e.target.value)}
          onBlur={() => onSave(row)}
          onKeyDown={(e) => e.key === "Enter" && onSave(row)}
          className="flex-1"
        />
        <div className="flex flex-col flex-1">
          <Input
            value={row.slug}
            placeholder="Slug ویژگی"
            onChange={(e) => onChange(row.id, "slug", e.target.value)}
            onBlur={() => isValid && onSave(row)}
            onKeyDown={(e) => e.key === "Enter" && isValid && onSave(row)}
            className={` ${!isValid ? "border-destructive" : ""}`}
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
        {row.values.map((v, i) => (
          <div className="flex items-center gap-2" key={v.id || i}>
            <Input
              value={v.value}
              placeholder={`مقدار ${i + 1}`}
              onChange={(e) => onValueChange(row.id, i, e.target.value)}
              onBlur={() => onSave(row)}
              onKeyDown={(e) => e.key === "Enter" && onSave(row)}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteValue(row.id, i)}
            >
              <Trash />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => onAddValue(row.id)}>
          + افزودن مقدار جدید
        </Button>
      </div>

      {/* Delete Attribute Button */}
      <div className="flex flex-col justify-between gap-2 mt-2 md:mt-0 self-stretch">
        <ConfirmDialogButton
          buttonText={<Trash />}
          dialogTitle="حذف ویژگی"
          dialogDescription="آیا از حذف این ویژگی مطمئنید؟"
          onConfirm={() => onDelete(row.id)}
          variant="destructive"
          size="sm"
        />
      </div>
    </div>
  );
}
