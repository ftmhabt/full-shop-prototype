import BlogEditor from "@/components/blog/BlogEditor";
import { db } from "@/lib/db";

export default async function EditBlogPage({ params }: any) {
  const post = await db.blogPost.findFirst({
    where: { id: params.id },
    include: {
      tags: true,
      category: true,
    },
  });

  if (!post) {
    return <div>پست پیدا نشد</div>;
  }

  return (
    <div className="p-4">
      <BlogEditor
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          category: post.category
            ? { value: post.category.id, label: post.category.name }
            : null,
          tags: post.tags.map(
            (t: { id: string; name: string; slug: string }) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
            })
          ),
        }}
      />
    </div>
  );
}
