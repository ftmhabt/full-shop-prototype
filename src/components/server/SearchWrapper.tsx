import { getProductsBySearch } from "@/app/actions/products";
import FiltersForm from "@/componets/FiltersForm";
import SortBar from "@/componets/SortBar";
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:p-6 w-full">
      {/* Sidebar filters */}
      <aside className="lg:col-span-1 space-y-4">
        <FiltersForm query={q} filters={filters} attributes={attributes} />
      </aside>

      {/* Products */}
      <main className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between gap-3 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-bold block">محصولات</h1>
          <SortBar />
        </div>
        <ProductsWrapper products={products} />
      </main>
    </div>
  );
}
