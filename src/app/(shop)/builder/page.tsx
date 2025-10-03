import DeviceBuilder from "@/components/builder/DeviceBuilder";
import db from "@/lib/db";
import { usdToToman } from "@/lib/exchange";

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

  const standardizedCategories = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      products: await Promise.all(
        cat.products.map(async (p) => ({
          ...p,
          price: p.price.toNumber(),
          priceToman: await usdToToman(p.price.toNumber()),
        }))
      ),
    }))
  );

  return <DeviceBuilder categoriesProp={standardizedCategories} />;
}
