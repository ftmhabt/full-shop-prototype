import { getCategoriesBySearch } from "@/app/actions/search";

export default async function SearchWrapper({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const sp = await searchParams;
  const q = sp.q as string;

  // یه فانکشن جدید که دسته‌بندی‌های مرتبط با سرچ رو میاره
  const categories = await getCategoriesBySearch(q);

  return (
    <div className="p-6 w-full space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold">
        انتخاب دسته برای &quot;{q}&quot;
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/category/${cat.slug}/search?q=${q}`}
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            {cat.name}
          </a>
        ))}
      </div>
    </div>
  );
}
