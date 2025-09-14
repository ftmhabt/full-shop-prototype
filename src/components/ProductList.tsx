import { Card, CardContent } from "@/components/ui/card";
import { Prisma } from "@prisma/client";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export function ProductList({ products }: { products: ProductWithCategory[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="rounded-2xl shadow hover:shadow-lg transition"
        >
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="aspect-square bg-card rounded-lg flex items-center justify-center">
              📷
            </div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category?.name}</p>
            <p className="font-semibold">
              {product.price.toLocaleString()} تومان
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
