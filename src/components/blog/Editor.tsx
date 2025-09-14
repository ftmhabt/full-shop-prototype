"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditorContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { useState } from "react";

export default function Editor({ editor }: { editor: any }) {
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>

        {/* لیست نامرتب */}
        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </Button>

        {/* لیست مرتب */}
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        {/* لینک با Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              <LinkIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            <Input
              placeholder="آدرس لینک را وارد کنید"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button size="sm" onClick={addLink}>
              ثبت لینک
            </Button>
          </PopoverContent>
        </Popover>

        {/* تراز متن */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          راست
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          چپ
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          وسط
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
