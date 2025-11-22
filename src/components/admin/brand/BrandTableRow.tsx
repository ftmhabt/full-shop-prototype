"use client";
import { ConfirmDialogButton } from "@/components/common/ConfirmDialogButton";
import { FallbackImage } from "@/components/FallbackImage";
import { Button } from "@/components/ui/button";
import { Brand } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";

export default function BrandTableRow({
  brand,
  onDelete,
  onEdit,
}: {
  brand: Brand;
  onDelete: (id: string) => void;
  onEdit: () => void;
}) {
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-2">{brand.name}</td>
      <td className="p-2">
        <FallbackImage
          src={brand.logo || ""}
          alt={brand.name || ""}
          width={100}
          height={40}
          className="rounded-md object-cover"
        />
      </td>

      <td className="p-2 text-right">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>

        <ConfirmDialogButton
          buttonText={<Trash className="h-4 w-4 text-destructive" />}
          dialogTitle="حذف برند"
          dialogDescription="آیا از حذف این برند مطمئنید؟"
          onConfirm={() => onDelete(brand.id)}
          variant="ghost"
          size="icon"
        />
      </td>
    </tr>
  );
}
