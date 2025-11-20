import DeviceBuilder from "@/components/builder/DeviceBuilder";
import db from "@/lib/db";
import { getRateCached } from "@/lib/exchangeCache";
import { getLatestRate } from "@/lib/latestRate";

export default async function DeviceBuilderPage() {
  const rate = await getRateCached(getLatestRate);

  const categories = await db.category.findMany({
    where: {
      inBundle: true,
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          slug: true,
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
          priceToman: Math.round(p.price.toNumber() * rate),
        }))
      ),
    }))
  );

  return <DeviceBuilder categoriesProp={standardizedCategories} />;
}
