import { Loader2 } from "lucide-react";

export default function CategoryLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="flex flex-col gap-3 items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-primary">در حال بارگذاری محصولات…</p>
      </div>
    </div>
  );
}
