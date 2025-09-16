"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogCategory, BlogPost, BlogTag, User } from "@prisma/client";
import { Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

type Blog = BlogPost & {
  tags: BlogTag[];
  category: BlogCategory | null;
  author: User | null;
};

export default function AdminBlogList({ blogs }: { blogs: Blog[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("آیا از حذف این پست مطمئن هستید؟")) return;

    startTransition(() => {
      // deleteBlogPost(id);
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">پست‌ها</h1>
        <Link href="/admin/blog/create" className="mb-4">
          <Button>ایجاد پست جدید</Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نویسنده</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog?.author?.displayName}</TableCell>
                  <TableCell>{blog.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-2">
                    {/* دکمه مشاهده */}
                    <Link href={`/blog/${blog.category?.slug}/${blog.slug}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>

                    {/* دکمه ویرایش */}
                    <Link href={`/admin/blog/${blog.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4 mr-1" />
                      </Button>
                    </Link>

                    {/* دکمه حذف */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(blog.id)}
                      disabled={isPending}
                    >
                      <Trash className="w-4 h-4 mr-1 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
