"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Select from "react-select";
import slugify from "slugify";

type OptionType = {
  value: string;
  label: string;
};

interface TagInputProps {
  selectedTags: OptionType[];
  availableTags: OptionType[];
  onTagsChange: (tags: OptionType[]) => void;
  onNewTagAdd?: (tag: OptionType) => void; // Pass tag object back
}

export function TagInput({
  selectedTags,
  availableTags,
  onTagsChange,
  onNewTagAdd,
}: TagInputProps) {
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagSlug, setNewTagSlug] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewTagName(name);

    if (
      !newTagSlug ||
      newTagSlug === slugify(newTagName, { lower: true, locale: "fa" })
    ) {
      setNewTagSlug(slugify(name, { lower: true, locale: "fa" }));
    }
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const newTag = {
      value: newTagSlug,
      label: newTagName,
      slug: newTagSlug,
    };

    // ✅ Only notify parent — do NOT change local state
    onNewTagAdd?.(newTag);

    // Reset form & close dialog
    setNewTagName("");
    setNewTagSlug("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedTags}
        onChange={(selected) => onTagsChange(selected as OptionType[])}
        options={availableTags}
        isMulti
        isRtl
        placeholder="انتخاب تگ‌ها"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            افزودن تگ جدید
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>افزودن تگ جدید</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label>نام تگ</Label>
              <Input value={newTagName} onChange={handleNameChange} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>اسلاگ</Label>
              <Input
                value={newTagSlug}
                onChange={(e) => setNewTagSlug(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddTag}>ذخیره</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
