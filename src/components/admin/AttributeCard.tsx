"use client";

import { deleteAttribute } from "@/app/actions/admin/attributes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";

export function AttributeCard({ attribute }: { attribute: any }) {
  const handleDelete = async () => {
    try {
      await deleteAttribute(attribute.id, attribute.categoryId);
      toast.success("ویژگی حذف شد");
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف ویژگی");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{attribute.name}</h3>
        <p className="text-sm text-muted-foreground">slug: {attribute.slug}</p>
      </div>
      <div className="flex justify-between mt-4">
        <Link
          href={`/admin/categories/${attribute.categoryId}/attributes/${attribute.id}/values`}
        >
          <Button size="sm">مدیریت مقادیر</Button>
        </Link>

        <ConfirmDialogButton
          buttonText="حذف"
          dialogTitle="حذف ویژگی"
          dialogDescription="آیا از حذف این ویژگی مطمئنید؟"
          onConfirm={handleDelete}
          variant="destructive"
          size="sm"
        />
      </div>
    </div>
  );
}
