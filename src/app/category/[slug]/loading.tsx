export default function CategoryLoading() {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center space-y-4">
      <p>در حال بارگذاری محصولات…</p>
      <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
        <div className="h-1 bg-blue-500 animate-loading" />
      </div>
    </div>
  );
}
