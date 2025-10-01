import ProductsGrid from "@/components/admin/ProductsGrid";
import { db } from "@/lib/db";
import { usdToToman } from "@/lib/exchange";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reviews: true,
    },
  });

  const productsWithToman = await Promise.all(
    products.map(async (p) => ({
      ...p,
      price: p.price.toNumber(),
      oldPrice: p.oldPrice?.toNumber(),
      priceToman: await usdToToman(p.price?.toNumber()),
    }))
  );

  return <ProductsGrid products={productsWithToman} />;
}
