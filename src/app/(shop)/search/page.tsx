import SearchWrapper from "@/components/server/SearchWrapper";

export default function SearchPage({ searchParams }: any) {
  return (
    <div className="p-6 w-full">
      <SearchWrapper searchParams={searchParams} />
    </div>
  );
}
