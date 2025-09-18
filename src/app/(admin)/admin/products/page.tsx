import ProductsGrid from "@/components/admin/ProductsGrid";
import { db } from "@/lib/db";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reviews: true,
    },
  });

  return <ProductsGrid products={products} />;
}
