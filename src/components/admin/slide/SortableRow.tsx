"use client";
import { ConfirmDialogButton } from "@/components/common/ConfirmDialogButton";
import { FallbackImage } from "@/components/FallbackImage";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSortable } from "@dnd-kit/sortable";
import { HeroSlide } from "@prisma/client";
import { GripVertical, Pencil, Trash } from "lucide-react";

export default function SortableRow({
  slide,
  onToggle,
  onDelete,
  onEdit,
}: {
  slide: HeroSlide;
  onToggle: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide.id });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition,
      }}
      className="border-b hover:bg-muted/50"
    >
      <td className="p-2 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </td>
      <td className="p-2">
        <FallbackImage
          src={slide.image}
          alt={slide.title || ""}
          width={100}
          height={40}
          className="rounded-md object-cover"
        />
      </td>
      {/* <td className="p-2">{slide.order}</td> */}
      <td className="p-2">
        <Switch
          checked={slide.isActive}
          onCheckedChange={(val) => onToggle(slide.id, val)}
        />
      </td>
      <td className="p-2 text-right">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>

        <ConfirmDialogButton
          buttonText={<Trash className="h-4 w-4 text-destructive" />}
          dialogTitle="حذف اسلاید"
          dialogDescription="آیا از حذف این اسلاید مطمئنید؟"
          onConfirm={() => onDelete(slide.id)}
          variant="ghost"
          size="icon"
        />
      </td>
    </tr>
  );
}
