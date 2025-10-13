"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
    <div className="space-y-6 p-4">
      {/* --- Header Actions --- */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-right w-full sm:w-auto">
          مدیریت پست‌ها
        </h1>

        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <Link href="/admin/blog/blog-categories">
            <Button variant="secondary">دسته‌ها</Button>
          </Link>
          <Link href="/admin/blog/blog-tags">
            <Button variant="secondary">برچسب‌ها</Button>
          </Link>
          <Link href="/admin/blog/create">
            <Button>ایجاد پست جدید</Button>
          </Link>
        </div>
      </div>

      {/* --- Table View (Desktop) --- */}
      <div className="overflow-x-auto w-full border rounded-md hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">عنوان</TableHead>
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">نویسنده</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">تعداد برچسب‌ها</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.category?.name ?? "-"}</TableCell>
                <TableCell>
                  {blog.author?.displayName ?? "بدون نویسنده"}
                </TableCell>
                <TableCell>
                  {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
                </TableCell>
                <TableCell>{blog.tags.length}</TableCell>
                <TableCell className="flex gap-2">
                  {/* مشاهده */}
                  <Link href={`/blog/${blog.category?.slug}/${blog.slug}`}>
                    <Button size="sm" variant="ghost" title="مشاهده">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* ویرایش */}
                  <Link href={`/admin/blog/${blog.id}/edit`}>
                    <Button size="sm" variant="ghost" title="ویرایش">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* حذف */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(blog.id)}
                    disabled={isPending}
                    title="حذف"
                  >
                    <Trash className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Mobile Cards --- */}
      <div className="grid gap-4 md:hidden">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader className="flex justify-between items-center">
              <span className="font-semibold text-base">{blog.title}</span>
              <span className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <p>✍️ نویسنده: {blog.author?.displayName ?? "بدون نویسنده"}</p>
              <p>📂 دسته‌بندی: {blog.category?.name ?? "-"}</p>
              <p>🏷️ تعداد برچسب‌ها: {blog.tags.length}</p>
            </CardContent>

            <CardFooter className="flex gap-2 justify-end">
              <Link href={`/blog/${blog.category?.slug}/${blog.slug}`}>
                <Button size="sm" variant="outline">
                  مشاهده
                </Button>
              </Link>
              <Link href={`/admin/blog/${blog.id}/edit`}>
                <Button size="sm" variant="default">
                  ویرایش
                </Button>
              </Link>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(blog.id)}
                disabled={isPending}
              >
                حذف
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
