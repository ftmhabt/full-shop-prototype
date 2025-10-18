import { FallbackImage } from "@/components/FallbackImage";
import BlogCategorySchemas from "@/components/SEO/BlogCategorySchemas";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import { usdToToman } from "@/lib/exchange";
import { getBlogCategoryMetadata } from "@/lib/metadata/blogCategoryMetadata";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: any) {
  return getBlogCategoryMetadata(params.catSlug);
}

export default async function BlogCategoryPage({ params }: any) {
  const category = await db.blogCategory.findUnique({
    where: { slug: params.catSlug },
    include: {
      posts: {
        include: {
          author: { select: { displayName: true } },
          tags: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  console.log("catg", category);
  if (!category) return notFound();

  // Fetch products related to this blog category
  const relatedProducts = await db.product.findMany({
    where: {
      category: {
        slug: category.slug,
      },
    },
    take: 6,
  });
  const standardizedRelatedProducts = await Promise.all(
    relatedProducts.map(async (p) => ({
      ...p,
      price: p.price.toNumber(),
      priceToman: await usdToToman(p.price.toNumber()),
    }))
  );

  return (
    <>
      {/* ✅ SEO JSON-LD */}
      <BlogCategorySchemas category={category} />

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
                  بلاگ
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-foreground">{category.name}</li>
            </ol>
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-2">
                {category.description}
              </p>
            )}
          </div>

          {/* Blog Post List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.posts.length === 0 ? (
              <p className="md:col-span-full text-center text-muted-foreground">
                در حال حاضر هیچ مطلبی در این دسته بندی وجود ندارد.
              </p>
            ) : (
              category.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${params.catSlug}/${post.slug}`}
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

        {/* Products Sidebar Column */}
        {standardizedRelatedProducts.length > 0 && (
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">محصولات این دسته</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {standardizedRelatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-4"
                  >
                    <FallbackImage
                      src={product.image[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                      width={30}
                      height={30}
                    />
                    <div>
                      <h4 className="text-sm font-semibold">{product.name}</h4>
                      <p className="text-primary font-bold mt-1">
                        {product.priceToman.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
