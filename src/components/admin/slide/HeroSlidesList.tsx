"use client";

import {
  deleteHeroSlide,
  toggleHeroSlideActive,
  updateHeroSlidesOrder,
} from "@/app/actions/admin/hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { HeroSlide } from "@prisma/client";
import { useState, useTransition } from "react";
import EditHeroSlideForm from "./EditHeroSlideForm";
import SortableRow from "./SortableRow";

export default function HeroSlidesList({
  initialSlides,
}: {
  initialSlides: HeroSlide[];
}) {
  const [slides, setSlides] = useState(initialSlides);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(slides, oldIndex, newIndex);
    const updated = reordered.map((s, idx) => ({ ...s, order: idx }));

    setSlides(updated);

    startTransition(() => {
      updateHeroSlidesOrder(updated);
    });
  };

  const handleToggleActive = (id: string, value: boolean) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: value } : s))
    );
    startTransition(() => toggleHeroSlideActive(id, value));
  };

  const handleDelete = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    startTransition(() => deleteHeroSlide(id));
  };
  const [selected, setSelected] = useState<HeroSlide | null>(null);
  return (
    <Card className="p-4">
      <Button onClick={() => setIsAdding(true)} className="mb-4">
        ➕ Add Slide
      </Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={slides.map((s) => s.id)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Image</TableHead>
                {/* <TableHead>Order</TableHead> */}
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.map((slide) => (
                <SortableRow
                  key={slide.id}
                  slide={slide}
                  onToggle={handleToggleActive}
                  onDelete={handleDelete}
                  onEdit={() => setSelected(slide)}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
      {selected && (
        <EditHeroSlideForm
          slide={{
            ...selected,
            title: selected.title ?? undefined,
            url: selected.url ?? undefined,
            subtitle: selected.subtitle ?? undefined,
            primaryButtonLabel: selected.primaryButtonLabel ?? undefined,
            primaryButtonUrl: selected.primaryButtonUrl ?? undefined,
            secondaryButtonLabel: selected.secondaryButtonLabel ?? undefined,
            secondaryButtonUrl: selected.secondaryButtonUrl ?? undefined,
          }}
          open={!!selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) =>
            setSlides((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            )
          }
        />
      )}
      {/* Create New Slide Form */}
      {isAdding && (
        <EditHeroSlideForm
          slide={{
            title: "",
            subtitle: "",
            url: "",
            image: "",
            order: slides.length,
            isActive: true,
            primaryButtonLabel: "",
            primaryButtonUrl: "",
            secondaryButtonLabel: "",
            secondaryButtonUrl: "",
          }}
          open={isAdding}
          onClose={() => setIsAdding(false)}
          onUpdated={(newSlide) => {
            setSlides((prev) => [...prev, newSlide]);
            setIsAdding(false);
          }}
          isNew
        />
      )}
    </Card>
  );
}
