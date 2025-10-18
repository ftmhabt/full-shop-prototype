import { getBlogPosts } from "@/app/actions/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogSchemas from "@/components/SEO/BlogSchemas";
import { getBlogPageMetadata } from "@/lib/metadata/blogPageMetadata";

export async function generateMetadata() {
  return getBlogPageMetadata();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <BlogSchemas posts={posts} />

      <div className="mb-auto p-6">
        <h1 className="text-3xl font-bold mb-6">وبلاگ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <BlogPostCard
                key={post.id}
                categorySlug={post.category?.slug || ""}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt || ""}
                author={post.author.displayName || ""}
                date={new Date(post.createdAt).toLocaleDateString("fa-IR")}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">پستی یافت نشد</p>
          )}
        </div>
      </div>
    </>
  );
}
