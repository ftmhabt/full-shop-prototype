"use client";

import { createBlogPost } from "@/app/actions/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import slugify from "slugify";
import { Button } from "../ui/button";
import Editor from "./Editor";

// Sample categories and tags (replace with API call)
const categories = [
  { value: "frontend", label: "فرانت‌اند" },
  { value: "backend", label: "بک‌اند" },
];

const availableTags = [
  { value: "nextjs", label: "Next.js" },
  { value: "tiptap", label: "TipTap" },
];

export default function BlogEditor({ onChange }: { onChange?: any }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-rose dark:prose-invert focus:outline-none text-right",
      },
    },
    immediatelyRender: false,
  });

  const handleSave = async () => {
    const data = {
      title,
      slug,
      excerpt,
      categoryId: category?.value,
      tagIds: tags.map((t) => t.value),
      content: editor?.getHTML(),
    };

    startTransition(async () => {
      try {
        await createBlogPost(data);
        toast.success("پست با موفقیت ذخیره شد");
      } catch (err: any) {
        toast.error("خطا در ذخیره: " + err.message);
      }
    });
  };
  // Auto-generate slug from Farsi title
  useEffect(() => {
    const newSlug = slugify(title, { lower: true, locale: "fa" });
    setSlug(newSlug);
  }, [title]);

  // Pass blog data to parent if needed
  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        slug,
        excerpt,
        category: category?.value,
        tags: tags.map((t) => t.value),
        content: editor?.getHTML(),
      });
    }
  }, [title, slug, excerpt, category, tags, editor?.getHTML()]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>نوشتن پست بلاگ</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>عنوان</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان پست"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>اسلاگ</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="اسلاگ پست"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>خلاصه</Label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="خلاصه کوتاه برای SEO"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>دسته‌بندی</Label>
          <Select
            value={category}
            onChange={setCategory}
            options={categories}
            placeholder="انتخاب دسته‌بندی"
            isRtl
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>تگ‌ها</Label>
          <Select
            value={tags}
            onChange={setTags}
            options={availableTags}
            placeholder="انتخاب یا ایجاد تگ"
            isMulti
            isRtl
            isClearable
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>محتوا</Label>
          <div className="border rounded p-2 min-h-[300px]">
            {editor && <Editor editor={editor} />}
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 rounded"
        >
          {isPending ? "در حال ذخیره..." : "ذخیره پست"}
        </Button>
      </CardContent>
    </Card>
  );
}
