import BlogTagSchemas from "@/components/SEO/BlogTagSchemas";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import { getBlogTagMetadata } from "@/lib/metadata/blogTagMetadata";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any) {
  return getBlogTagMetadata(params.slug);
}

export default async function TagPage({ params }: any) {
  const tag = await db.blogTag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        include: {
          author: { select: { displayName: true } },
          category: true,
          tags: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!tag) return notFound();

  return (
    <>
      {/* SEO JSON-LD */}
      <BlogTagSchemas tag={tag} />

      <div className="container py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 mb-auto">
        {/* Blog Posts Column */}
        <div className="lg:col-span-3">
          {/* Breadcrumbs */}
          <nav
            className="text-sm text-muted-foreground mb-4"
            aria-label="Breadcrumb"
          >
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-primary hover:underline">
                  خانه
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/blog" className="text-primary hover:underline">
                  مقالات
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-foreground">{tag.name}</li>
            </ol>
          </nav>

          {/* Tag Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">{tag.name}</h1>
            {tag.description && (
              <p className="text-muted-foreground mt-2">{tag.description}</p>
            )}
          </div>

          {/* Blog Post List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tag.posts.length === 0 ? (
              <p className="md:col-span-full text-center text-muted-foreground">
                در حال حاضر هیچ مطلبی در این برچسب وجود ندارد.
              </p>
            ) : (
              tag.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.category?.slug}/${post.slug}`}
                  className="block"
                >
                  <Card className="h-full flex flex-col hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        {new Date(post.createdAt).toLocaleDateString("fa-IR")} -{" "}
                        {post.author.displayName ?? "ناشناس"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
