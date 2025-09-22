"use client";

import {
  deleteAttributeWithValues,
  updateAttributeWithValues,
} from "@/app/actions/admin/attributes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AttributeRow, { Attribute } from "./AttributeRow";

interface AttributesListProps {
  attributes: Attribute[];
  categoryId: string;
}

export function AttributesList({
  attributes,
  categoryId,
}: AttributesListProps) {
  const router = useRouter();

  const handleSave = async (row: Attribute) => {
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

      toast.success(`ویژگی "${row.name}" ذخیره شد`);
      router.refresh(); // Always re-fetch fresh data
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره ویژگی");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttributeWithValues(id, categoryId);
      toast.success("ویژگی حذف شد");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف ویژگی");
    }
  };

  return (
    <div className="space-y-4">
      {attributes.length === 0 ? (
        <p className="text-muted-foreground text-center">
          هیچ ویژگی‌ای برای این دسته وجود ندارد.
        </p>
      ) : (
        attributes.map((row) => (
          <AttributeRow
            key={row.id}
            row={row}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
