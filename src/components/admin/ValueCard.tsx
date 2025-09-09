"use client";

import { deleteAttributeValue } from "@/app/actions/admin/values";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";

interface ValueCardProps {
  value: {
    id: string;
    value: string;
    slug: string;
  };
  attributeId: string;
}

export function ValueCard({ value, attributeId }: ValueCardProps) {
  const handleDelete = async () => {
    try {
      await deleteAttributeValue(value.id, attributeId);
      toast.success("مقدار حذف شد");
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف مقدار");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{value.value}</h3>
        <p className="text-sm text-muted-foreground">slug: {value.slug}</p>
      </div>
      <div className="flex justify-end mt-4">
        <ConfirmDialogButton
          buttonText="حذف"
          dialogTitle="حذف مقدار"
          dialogDescription="آیا از حذف این مقدار مطمئنید؟"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
        />
      </div>
    </div>
  );
}
