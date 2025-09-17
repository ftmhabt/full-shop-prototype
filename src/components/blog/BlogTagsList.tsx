"use client";

import { deleteBlogTag } from "@/app/actions/blog";
import { Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmDialogButton } from "../common/ConfirmDialogButton";
import { BlogTagDialog } from "./BlogTagDialog";

export function BlogTagsList({ blogTags }: { blogTags: any[] }) {
  const handleDelete = async (id: string) => {
    try {
      await deleteBlogTag(id);
      toast.success("برچسب حذف شد");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "خطا در حذف دسته");
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {blogTags.map((tag) => (
        <div
          key={tag.id}
          className="border rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-lg">{tag.name}</h3>
            <p className="text-sm text-muted-foreground">slug: {tag.slug}</p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <BlogTagDialog
              initialData={tag}
              triggerLabel={<Edit size={10} />}
            />
            <ConfirmDialogButton
              buttonText={<Trash color="white" />}
              dialogTitle="حذف برچسب"
              dialogDescription="آیا از حذف این برچسب مطمئنید؟"
              onConfirm={() => handleDelete(tag.id)}
              variant="destructive"
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
