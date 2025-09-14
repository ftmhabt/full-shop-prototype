import { getBlogPosts } from "@/app/actions/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">وبلاگ</h1>
      <div className="grid gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {new Date(post.createdAt).toLocaleDateString("fa-IR")} -{" "}
                    {post.author.displayName ?? "ناشناس"}
                  </CardDescription>
                </CardHeader>
                {post.excerpt && (
                  <CardContent>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-center text-muted-foreground">پستی یافت نشد</p>
        )}
      </div>
    </div>
  );
}
