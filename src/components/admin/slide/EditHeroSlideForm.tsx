"use client";

import { createHeroSlide, updateHeroSlide } from "@/app/actions/admin/hero";
import { FallbackImage } from "@/components/FallbackImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HeroSlideFormValues, heroSlideSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function EditHeroSlideForm({
  slide,
  open,
  onClose,
  onUpdated,
  isNew = false,
}: {
  slide: HeroSlideFormValues & { id?: string; image?: string };
  open: boolean;
  onClose: () => void;
  onUpdated: (updatedSlide: any) => void;
  isNew?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      ...slide,
      subtitle: slide.subtitle ?? "",
      primaryButtonLabel: slide.primaryButtonLabel ?? "",
      primaryButtonUrl: slide.primaryButtonUrl ?? "",
      secondaryButtonLabel: slide.secondaryButtonLabel ?? "",
      secondaryButtonUrl: slide.secondaryButtonUrl ?? "",
    },
  });

  const onSubmit = (values: HeroSlideFormValues) => {
    startTransition(async () => {
      try {
        let updated;
        const file = values.imageFile?.[0];

        if (isNew) {
          updated = await createHeroSlide(values, file);
          toast.success("New slide created");
        } else {
          updated = await updateHeroSlide(slide.id!, values, file);
          toast.success("Slide updated");
        }

        onUpdated(updated);
        onClose();
      } catch (err) {
        console.error(err);
        toast.error("Failed to save slide");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Hero Slide</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
          </div>

          {/* Subtitle */}
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" {...form.register("subtitle")} />
          </div>

          {/* Image */}
          <div>
            <Label>Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                {...form.register("imageFile")}
              />
              {/* Show current uploaded image if no new file is selected */}
              {!form.watch("imageFile")?.length && slide.image && (
                <FallbackImage
                  src={slide.image} // <-- use slide.image directly
                  alt="Current slide image"
                  className="mt-2 h-24 w-auto rounded-md object-cover"
                  width="20"
                  height="20"
                />
              )}
              {/* Show preview if a new file is selected */}
              {form.watch("imageFile")?.length > 0 && (
                <FallbackImage
                  src={URL.createObjectURL(form.watch("imageFile")[0])}
                  alt="New image preview"
                  className="mt-2 h-24 w-auto rounded-md object-cover"
                  width="20"
                  height="20"
                />
              )}{" "}
            </div>
          </div>

          {/* Order */}
          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              {...form.register("order", { valueAsNumber: true })}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label>Active</Label>
          </div>

          {/* Buttons */}
          <div className="space-y-1">
            <Label>Primary Button Label</Label>
            <Input {...form.register("primaryButtonLabel")} />
            <Label>Primary Button URL</Label>
            <Input {...form.register("primaryButtonUrl")} />
          </div>

          <div className="space-y-1">
            <Label>Secondary Button Label</Label>
            <Input {...form.register("secondaryButtonLabel")} />
            <Label>Secondary Button URL</Label>
            <Input {...form.register("secondaryButtonUrl")} />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
