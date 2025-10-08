import BlogPostCard from "@/components/blog/BlogPostCard";
import { Button } from "@/components/ui/button";
import { BlogCategory, BlogPost, User } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BlogRowProps {
  blogPosts: (BlogPost & {
    category: BlogCategory | null;
    author: User;
  })[];
}

export default function BlogRow({ blogPosts }: BlogRowProps) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">مطالب خواندنی</h2>
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-1">
            مشاهده همه <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            categorySlug={post.category?.slug || ""}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt || ""}
            author={post.author.displayName || ""}
            date={new Date(post.createdAt).toLocaleDateString("fa-IR")}
          />
        ))}
      </div>
    </section>
  );
}
