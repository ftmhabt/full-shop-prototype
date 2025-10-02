import { FallbackImage } from "@/components/FallbackImage";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import db from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: any) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { displayName: true } },
      category: true,
      tags: true,
    },
  });

  if (!post) return notFound();

  const allCategories = await db.blogCategory.findMany();

  const relatedProducts = await db.product.findMany({
    where: { categoryId: post.category?.id },
    take: 4,
  });

  const standardizedRelatedProducts = relatedProducts.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));
  return (
    <div className="container py-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-auto">
      {/* Main Content Column */}
      <div className="md:col-span-3">
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
                بلاگ
              </Link>
              <span className="mx-2">/</span>
            </li>
            {post.category && (
              <li className="flex items-center">
                <Link
                  href={`/blog/${post.category.slug}`}
                  className="text-primary hover:underline"
                >
                  {post.category.name}
                </Link>
                <span className="mx-2">/</span>
              </li>
            )}
            <li className="text-foreground">{post.title}</li>
          </ol>
        </nav>

        {/* Blog Post Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{post.title}</CardTitle>
            <CardDescription>
              {new Date(post.createdAt).toLocaleDateString("fa-IR")} -{" "}
              {post.author.displayName ?? "ناشناس"}
              {post.category && ` • ${post.category.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Related Products Section */}
        {standardizedRelatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {standardizedRelatedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="block"
                >
                  <Card className="hover:border-primary transition-colors">
                    <CardHeader className="p-0">
                      <FallbackImage
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                        width={30}
                        height={30}
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-primary font-bold mt-2">
                        {product.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Column */}
      <div className="md:col-span-1 space-y-6">
        {/* Categories Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">دسته بندی ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/${category.slug}`}
                className="block text-sm text-primary hover:underline"
              >
                {category.name}
              </Link>
            ))}
          </CardContent>
        </Card>
        {post.tags.length > 0 && (
          <>
            <Separator />
            {/* Tags Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">برچسب ها</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
