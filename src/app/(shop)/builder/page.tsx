import DeviceBuilder from "@/components/builder/DeviceBuilder";
import db from "@/lib/db";

export default async function DeviceBuilderPage() {
  const categories = await db.category.findMany({
    where: {
      inBundle: true,
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          stock: true,
        },
      },
    },
  });

  const standardizedCategories = categories.map((cat) => ({
    ...cat,
    products: cat.products.map((p) => ({ ...p, price: p.price.toNumber() })),
  }));
  return <DeviceBuilder categoriesProp={standardizedCategories} />;
}
