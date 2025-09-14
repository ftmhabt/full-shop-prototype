import db from "@/lib/db";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: any) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { displayName: true } }, category: true },
  });

  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {new Date(post.createdAt).toLocaleDateString("fa-IR")} -{" "}
        {post.author.displayName ?? "ناشناس"}
        {post.category && ` • ${post.category.name}`}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
