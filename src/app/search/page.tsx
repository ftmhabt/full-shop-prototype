import SearchWrapper from "@/components/server/SearchWrapper";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className="p-6 w-full">
      <SearchWrapper searchParams={searchParams} />
    </div>
  );
}
