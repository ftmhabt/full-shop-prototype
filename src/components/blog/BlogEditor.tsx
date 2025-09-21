"use client";

import {
  createBlogPost,
  getBlogCategories,
  getBlogTags,
  updateBlogPost,
} from "@/app/actions/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSlugValidator } from "@/hooks/useSlugValidator";
import GapCursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import slugify from "slugify";
import { ShadcnSelect } from "../ShadcnSelect";
import { Button } from "../ui/button";
import Editor from "./Editor";
import { TagInput } from "./TagInput";

type OptionType = {
  value: string;
  label: string;
  slug?: string;
};

type BlogEditorProps = {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    categoryId?: string;
    category?: { value: string; label: string } | null;
    tags?: { id: string; name: string; slug: string }[];
    content: string;
  };
  onChange?: (data: any) => void;
  onSave?: (data: any) => Promise<void>;
};

export default function BlogEditor({
  mode,
  initialData,
  onChange,
  onSave,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const { isValid, errorMessage } = useSlugValidator(slug);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState<OptionType | null>(
    initialData?.category
      ? { value: initialData.category.value, label: initialData.category.label }
      : null
  );
  const [tags, setTags] = useState<OptionType[]>(
    initialData?.tags?.map((t) => ({ value: t.id, label: t.name })) || []
  );
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [availableTags, setAvailableTags] = useState<OptionType[]>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const fetchedCategories = await getBlogCategories();
      const fetchedTags = await getBlogTags();
      setCategories(fetchedCategories);
      setAvailableTags(fetchedTags);
    }
    fetchData();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      GapCursor,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      HardBreak.configure({
        HTMLAttributes: {
          class: "hard-break",
        },
      }),
    ],
    content: initialData?.content || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-rose dark:prose-invert focus:outline-none text-right",
      },
    },
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: "full",
    },
  });

  const handleNewTagAdd = (newTag: OptionType) => {
    setAvailableTags((prev) => [...prev, newTag]);
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    const data = {
      id: initialData?.id,
      title,
      slug,
      excerpt,
      categoryId: category?.value,
      tags: tags.map((t) => ({
        id: t.value?.length === 25 ? t.value : undefined,
        name: t.label,
        slug: t.slug || slugify(t.label, { lower: true, locale: "fa" }),
      })),
      content: editor?.getHTML(),
    };

    startTransition(async () => {
      try {
        if (onSave) {
          await onSave(data);
        } else {
          if (mode === "create") {
            await createBlogPost(data);
          } else {
            await updateBlogPost(data);
          }
        }
        toast.success(mode === "create" ? "پست ایجاد شد" : "پست ویرایش شد");
        router.push("/admin/blog");
      } catch (err: any) {
        toast.error("خطا: " + err.message);
      }
    });
  };

  useEffect(() => {
    if (!initialData?.slug) {
      const newSlug = slugify(title, { lower: true, locale: "fa" });
      setSlug(newSlug);
    }
  }, [title, initialData?.slug]);

  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        slug,
        excerpt,
        categoryId: category?.value,
        tagIds: tags.map((t) => t.value),
        content: editor?.getHTML(),
      });
    }
  }, [title, slug, excerpt, category, tags, editor?.getHTML()]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "نوشتن پست جدید" : "ویرایش پست"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <Label>عنوان</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان پست"
            />
          </div>
          {/* Slug */}
          <div className="flex flex-col gap-1">
            <Label>اسلاگ</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="اسلاگ پست"
            />
            {errorMessage && <p className="text-destructive">{errorMessage}</p>}
          </div>
          {/* Excerpt */}
          <div className="flex flex-col gap-1">
            <Label>خلاصه</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="خلاصه کوتاه برای SEO"
              rows={3}
            />
          </div>
          {/* Category */}
          <div className="flex flex-col gap-1">
            <Label>دسته‌بندی</Label>
            <ShadcnSelect
              value={category}
              onChange={(val) => setCategory(val as OptionType | null)}
              options={categories}
              placeholder="انتخاب دسته‌بندی"
              isRtl
            />
          </div>
          {/* Tags */}
          <div className="flex flex-col gap-1">
            <Label>برچسب‌ها</Label>
            <TagInput
              selectedTags={tags}
              availableTags={availableTags}
              onTagsChange={setTags}
              onNewTagAdd={handleNewTagAdd}
            />
          </div>
          {/* Content */}
          <div className="flex flex-col gap-1">
            <Label>محتوا</Label>
            <div className="border rounded p-2 min-h-[300px]">
              {editor && <Editor editor={editor} />}
            </div>
          </div>
          {/* Save button */}
          <Button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded"
          >
            {isPending
              ? "در حال ذخیره..."
              : mode === "create"
              ? "ایجاد پست"
              : "ذخیره تغییرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
