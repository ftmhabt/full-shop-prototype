export default function ProductSliderSkeleton() {
  return (
    <div className="flex flex-wrap gap-5 px-12 min-h-[400px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="
            flex-none
            w-full sm:w-[calc(50%-0.625rem)]
            md:w-[calc(33.333%-0.833rem)]
            lg:w-[calc(25%-1.25rem)]
            p-2
          "
        >
          <div className="animate-pulse rounded-2xl border border-muted/40 p-4 bg-background">
            <div className="aspect-square w-full rounded-xl bg-muted" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
            <div className="mt-4 flex flex-col gap-2 items-center">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-4 w-12 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
