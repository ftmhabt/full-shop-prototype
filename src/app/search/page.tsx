import SearchWrapper from "@/components/server/SearchWrapper";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  console.log("Search q:", query);

  return (
    <div className="p-6">
      <SearchWrapper query={query} searchParams={searchParams} />
    </div>
  );
}
