import { getPaginatedProducts } from "@/app/actions/admin/products";
import ProductsList from "@/components/admin/ProductList";

export default async function ProductsPage() {
  const { products, totalPages } = await getPaginatedProducts(1);

  return (
    <ProductsList
      initialProducts={products}
      initialPage={1}
      totalPages={totalPages}
    />
  );
}
