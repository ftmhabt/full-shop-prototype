import {
  getCategories,
  getProductsByCategorySlug,
} from "@/app/actions/products";
import { ProductList } from "@/componets/ProductList";
import { Sidebar } from "@/componets/Sidebar";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const products = await getProductsByCategorySlug(slug);
  console.log("slug:", slug);
  console.log("products:", products);
  console.log("categories:", categories);
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <aside className="col-span-3">
        <Sidebar categories={categories} selected={slug} />
      </aside>
      <main className="col-span-9">
        <ProductList products={products} />
      </main>
    </div>
  );
}
