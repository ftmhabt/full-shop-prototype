import { getCategoriesBySearch } from "@/app/actions/search";

export default async function SearchWrapper({ searchParams }: any) {
  const sp = searchParams;
  const query = sp.query as string;

  const categories = await getCategoriesBySearch(query);

  return (
    <div className="p-6 w-full space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold">
        &quot;{query}&quot; در کدام دسته جستجو شود؟
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}/search?query=${query}`}
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              {cat.name}
            </a>
          ))
        ) : (
          <p>این کالا در هیچ دسته‌ای یافت نشد</p>
        )}
      </div>
    </div>
  );
}
