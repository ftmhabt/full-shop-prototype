import { getProductsBySearch } from "@/app/actions/products";
import FiltersForm from "@/componets/FiltersForm";
import ProductsWrapper from "./ProductsWrapper";

export default async function SearchWrapper({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const q = searchParams.q as string;
  const filters: Record<string, string[]> = {};

  for (const key in searchParams) {
    if (key !== "q") {
      filters[key] = Array.isArray(searchParams[key])
        ? (searchParams[key] as string[])
        : [searchParams[key] as string];
    }
  }

  const { products, attributes } = await getProductsBySearch(q, filters);

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Sidebar filters */}
      <aside>
        <FiltersForm query={q} filters={filters} attributes={attributes} />
      </aside>

      {/* Products */}
      <main className="col-span-3 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">نتایج جستجو برای "{q}"</h1>
        </div>
        <ProductsWrapper products={products} />
      </main>
    </div>
  );
}
